const FormData = require('../../../.././utils/formdata')
Page({
  data: {
    reason: '',
    detail: '',
    id: '',
    title: '',
    userId: '',
    userName: '',
    image: [],
    imageList: [],
    flag: 0,
    state: 1,
    imageNums: '',
  },
  onLoad(options) {
    this.setData({id:options.id})
    this.getDetailData()
  },

  // 获取具体描述
  getDetail(e){
    this.setData({detail:e.detail.value,})
  },

  // 获取举报原因
  getReason(e){
    this.setData({reason:e.detail.value})
  },

  // 取消
  cancel(){
    var that = this
    wx.navigateTo({
      url: '/pages/shouye/help-page-detail/help-page-detail?id'+that.data.id,
    })
  },
  
  // 确认上传，循环上传图片
  confirm(){
    var that = this
    var imageList
    if(that.data.image.length == 0){
      imageList = null
      this.sendRequset()
    }
    else{
      imageList = that.data.image
      that.setData({imageNums:imageList.length})
    }
    if(imageList){
      wx.showLoading({title: '发布中...',})
      for(let i=0;i<imageList.length;i++){
        console.log(imageList[i])
        this.uploadImage(imageList[i])
        if(this.data.state != 1)
        {
          wx.showToast({title: '图片上传失败！',icon: 'error', duration: 1500, mask:true})
          return 
        }
      }
      wx.hideLoading()
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
        'content-type': data.contentType
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
        return 
      },
      fail(res){
        wx.hideLoading()
        console.log(res)
        wx.showToast({title: '图片上传失败！',icon: 'error', duration:1500, mask:true})
        that.setData({
          state:0
        })
        return 
      }
    });
  },
  //发送请求
  sendRequset(){
    console.log('发送请求')
    var that = this
    var title = that.data.title
    var imgList
    if(that.data.imageList.length == 0){
      imgList = null
    }
    else{
      imgList = that.data.imageList
    }
    var reportId = that.data.userId
    var requestId = that.data.id
    console.log(imgList,title)
    wx.request({
      url: 'http://8.130.118.211:5795/user/report',
      data:{
        'title': title,
        'userId': wx.getStorageSync('id'),
        'reportId': reportId,
        'requestId': requestId,
        'image': imgList,
      },
      header: {
        "authentication" : wx.getStorageSync('token')
      },
      method : 'POST',
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
          wx.showToast({
            title: '上传成功！',
            icon: 'success', 
            duration: 1500, 
            success: function () {
              setTimeout(function () {
              wx.reLaunch({
              url: '/pages/shouye/index/index',
                })
              }, 1500);}
          })
        }else{
          console.log(res)
        }
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },

  //获取帖子详细信息
  getDetailData:function(id){
    var that = this
    var id = that.data.id
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/request/' + id,
      headers: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'userId': wx.getStorageSync('id')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        var data = res.data.data
        that.setData({
          id: data.id,
          title: data.title,
          userId: data.userId,
          userName: data.userName,
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
                      wx.showToast({title: '头像上传失败',icon: 'error',duration: 1000});
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