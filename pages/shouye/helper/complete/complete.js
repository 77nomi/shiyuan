const FormData = require('../../../../utils/formdata.js')
Page({
  data: {
    title: '',
    userName: '',
    id: '',
    requestId: '',
    userId: '',
    content: '',
    bonus: '',
    image: [],
    imageList: [],
    imageNums: '',
    flag: '',
    state: 1,
  },

  onLoad(options) {
    this.setData({requestId:options.id})
    this.getDetailData()
  },

  // 获取文字描述
  getDetail(e){
    this.setData({content:e.detail.value})
  },
  // 取消
  cancel(){
    wx.navigateBack()
  },
  // 确认
  confirm(){
    var that = this
    wx.showModal({
      title: '确认上传',
      content: '点击确认后即上传',
      complete: (res) => {
        if (res.confirm) {
          if(!that.data.content){
            wx.showToast({title: '内容不能为空！',icon: 'error', duration:1500, mask: true,})
            return 
          }else{
            that.uploadDatas()
          }
        }
      }
    })
  },

  //获取详细信息
  getDetailData:function(){
    var id = this.data.requestId
    var that = this
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/request/' + id,
      header: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'userId': wx.getStorageSync('id')
      },
      method : 'GET',
      success: (res) => {
        // console.log(res)
        var data = res.data.data
        that.setData({
          'id': data.helpId,
          'title': data.title,
          'userName': data.userName,
          'bonus': data.bonus
        })
      },
      fail: (err) => {
        console.log(err)
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },
  //循环上传图片
  uploadDatas(){
    var that = this
    var imgList
    if(that.data.image.length == 0){
      imgList = null
      that.sendRequset()
    }
    else{
      imgList = that.data.image
      that.setData({imageNums:imgList.length})
    }
    if(imgList){
      for(let i=0;i<imgList.length;i++){
        console.log(imgList[i])
        that.uploadImage(imgList[i])
      }
    }
    
  },
  // 上传图片到服务器
  uploadImage(url) {
    wx.showLoading({title: '图片上传中',})
    var that = this
    let _name = url.split("\/");
    let name = _name[_name.length-1];
    name = name.length > 10 ? name.substring(name.length - 9, name.length) : name;
    let formData = new FormData();
    formData.appendFile("file",url,name);
    let data = formData.getData();
    console.log(data.buffer)
    wx.showLoading({title: '上传图片中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/file',
      header: {
        'content-type': data.contentType,
        authentication : wx.getStorageSync('token')
      },
      data: data.buffer,
      method: 'POST',
      success: function(res){
        wx.hideLoading()
        var imgurl = res.data.data
        var simageList = that.data.imageList
        simageList = simageList.concat(imgurl)
        that.setData({
          imageList: simageList,
          flag:that.data.flag+1
        })
        console.log(that.data.imageList)
        if(that.data.imageNums == that.data.flag)
        {
          wx.hideLoading()
          that.sendRequset()
        }
      },
      fail(res){
        wx.hideLoading()
        // console.log(res)
        wx.showToast({title: '图片上传失败！',icon: 'error', duration:1500, mask:true})
        that.setData({state:0})
        return 
      }
    });
  },
  //发送请求
  sendRequset(){
    if(this.data.state != 1){
      wx.showToast({title: '图片上传失败！',icon: 'error', duration: 1500, mask:true})
      return 
    }
    var that = this
    var id = this.data.id
    var requestId = this.data.requestId
    var userId = wx.getStorageSync('id')
    var content = this.data.content
    var bonus = this.data.bonus
    var image = this.data.imageList
    var data
    if(that.data.imageList.length == 0){
      data={
        id: id,
        status: 1,
        requestId: requestId,
        userId: userId,
        content: content,
        bonus: bonus,
      }
    }
    else{
      data={
        id: id,
        status: 1,
        requestId: requestId,
        userId: userId,
        content: content,
        bonus: bonus,
        image: that.data.imageList,
      }
    }
    wx.request({
      url: 'http://8.130.118.211:5795/user/help',
      data: data,
      header: {
        'content-type': 'application/json',
        "authentication" : wx.getStorageSync('token')
      },
      method : 'PUT',
      success: (res) => {
        // console.log(res)
        if(res.data.code==1){
          wx.showToast({
            title: '上传成功！',
            icon: 'success', 
            duration: 1500,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/shouye/help-page-detail/help-page-detail?id='+requestId,
                })
              }, 1500);}
          })
        }else{
          wx.showToast({title: res.data.msg,duration:1500,icon: 'error', mask: true,})
          // console.log(res)
        }
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },
  //选择照片
  chooseImage:function (){
    var that = this
    var imageList = this.data.image
    if(imageList.length < 3){
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success:  (res)=> {
          // console.log(res)
          var size = res.tempFiles[0]['size'];
          // 图片尺寸过大则压缩图片
          wx.showLoading({title: '上传中',duration: 1000, mask: true,})
          if (size > 1048579) {
            wx.getImageInfo({
              src: res.tempFilePaths[0],
              success: function (rr) {
                var ctx = wx.createCanvasContext('attendCanvasId');
                var ratio = 1;
                var canvasWidth = rr.width
                var canvasHeight = rr.height;
  
                var quality = 0.6;
                while (canvasWidth > 3000 || canvasHeight > 3000) {
                  canvasWidth = Math.trunc(rr.width / ratio)
                  canvasHeight = Math.trunc(rr.height / ratio)
                  ratio += 0.1;
                }
                quality = (quality + (ratio / 10)).toFixed(1);
                if (quality > 1) {
                  quality = 1;
                }
                that.setData({
                  canvasWidth: canvasWidth,
                  canvasHeight: canvasHeight
                });
                ctx.drawImage(res.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
                ctx.draw();
  
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'attendCanvasId',
                    width: 0,
                    height: 0,
                    destWidth: canvasWidth,
                    destHeight: canvasHeight,
                    fileType: 'jpg',
                    quality: quality,
                    success: function success(path) {
                      imageList.push(res.tempFiles[0].path)
                      that.setData({
                        image: imageList
                      });
                      wx.showToast({title: '上传成功',icon: 'success',duration: 500, mask: true,})
                    },
                    fail: function fail(e) {
                      wx.hideLoading();
                      wx.showToast({title: '头像上传失败',icon: 'error',duration: 1000, mask: true,});
                    }
                  });
                }, 1000);
              }
            });
          } else {
            imageList.push(res.tempFiles[0].path)
            that.setData({
              image: imageList
            });
            wx.showToast({title: '上传成功',icon: 'success',duration: 500, mask: true,})
          }
        }
      })
    }else{
      wx.showToast({
        title: '最多只能上传三张图片！',icon: 'none',duration: 1000, mask: true,
      })
    }
  },
  // 图片预览
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.image
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },
  // 删除照片
  deleteImage(e) {
    var index = e.currentTarget.dataset.index
    var imgData = this.data.image;
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确认删除则点击确定',
      success: function (res) {
        if (res.confirm) {
          imgData.splice(index, 1);
          that.setData({
              image: imgData
          })
        }
      }
    })
  },

})