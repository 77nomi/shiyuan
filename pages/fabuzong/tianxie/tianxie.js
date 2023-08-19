const FormData = require('../../../utils/formdata.js')
Page({
  data: {
    showOverlay: false,
    indexlabels:[
      {
        id:1,
        value:"问卷",
        isChoosed:false
      },
      {
        id:2,
        value:"提问",
        isChoosed:false
      },
      {
        id:3,
        value:"投票",
        isChoosed:false
      },
      {
        id:4,
        value:"跑腿",
        isChoosed:false
      },
      {
        id:5,
        value:"失物招领",
        isChoosed:false
      },
      {
        id:6,
        value:"租借",
        isChoosed:false
      },
      {
        id:7,
        value:"出/收物",
        isChoosed:false
      },
      {
        id:8,
        value:"其它",
        isChoosed:false
      }
    ],
    fileList: [],
    title: '',
    content: '',
    phone: '',
    nums: '',
    labels: [],
    emergency: '',
    bonus: '',
    reqTime: '',
    endTime: '',
  },

  //获取textarea内容
  getcontent(e){
    this.setData({
      content: e.detail.value,
    })
  },

  //获取第一页中的input数据
  getdatas1(e){
    var that = this
    if(!e.detail.value.title){
      wx.showToast({title: '标题不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!that.data.content){
      wx.showToast({title: '内容不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(e.detail.value.title.length>10){
      wx.showToast({title: '标题不能多于20个字',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!e.detail.value.phone){
      wx.showToast({title: '联系方式不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!e.detail.value.nums){
      wx.showToast({title: '帮助人数不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(e.detail.value.nums){
      var nums = e.detail.value.nums.replace(/\D/g, '')
      if(!nums){
        wx.showToast({title: '帮助人数格式错误！',icon: 'none', duration: 1000, mask: true,})
        return 
      }
    }
    if(e.detail.value.title && e.detail.value.phone && e.detail.value.nums){
      this.setData({
        title: e.detail.value.title,
        phone: e.detail.value.phone,
        nums: e.detail.value.nums,
      })
    }
    if(!this.getLabel())
      return 
    var datas = this.data
    if(datas.title && datas.content && datas.phone && datas.nums && datas.labels && datas.emergency){
      this.showOverlay()
    }else{
      wx.showToast({title: '暂无数据',icon: 'none', duration: 1000, mask: true,})
    }
  },

  //获取第二页中的input数据
  getdatas2(e){
    // console.log(e)
    var that = this
    if(!e.detail.value.bonus){
      wx.showToast({title: '报酬不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!e.detail.value.reqTime){
      wx.showToast({title: '开始时间不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!e.detail.value.endTime){
      wx.showToast({title: '结束时间不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(e.detail.value.bonus){
      var nums = e.detail.value.bonus.replace(/\D/g, '')
      if(!nums){
        wx.showToast({title: '报酬格式错误！',icon: 'none', duration: 1000, mask: true,})
        return 
      }
    }
    this.setData({
      bonus: e.detail.value.bonus,
      reqTime: e.detail.value.reqTime,
      endTime: e.detail.value.endTime,
    })
    this.uploadDatas()
  },

  //发请求
  uploadDatas(){
    // wx.showLoading({
    //   title:'发布中',
    // })
    var that = this
    var title = that.data.title
    var imgList
    if(!that.data.fileList)
      imgList = null
    else
      imgList = that.data.fileList
    var content = that.data.content
    var phone = that.data.phone
    var nums = Number(that.data.nums)
    var labels = that.data.labels
    var emergency = Number(that.data.emergency)
    var bonus = Number(that.data.bonus)
    var reqTime = that.data.reqTime
    var endTime = that.data.endTime
    console.log(imgList,title,content,phone,nums,labels,emergency,bonus,reqTime,endTime)
    var state = 1
    for(let i=0;i<imgList.length;i++){
      console.log(imgList[i])
      state = this.uploadImage(imgList[i])
      if(state != 1){
        return 
      }
    }
    // wx.request({
    //   url: 'http://8.130.118.211:5795/user/request',
    //   data:{
    //     'id': null,
    //     'userId': wx.getStorageSync('id'),
    //     'title': title,
    //     'content': content,
    //     'reqNum': nums,
    //     'helpNum': null,
    //     'contact': phone,
    //     'bonus': bonus,
    //     'reqTime': null,
    //     'endTime': null,
    //     'emergency': emergency,
    //     'image': imgList,
    //     'labels': labels,
    //   },
    //   header: {
    //     'content-type': 'application/json',
    //     "authentication" : wx.getStorageSync('token')
    //   },
    //   method : 'POST',
    //   success: (res) => {
    //     console.log(res)
    //     if(res.data.code==1){
    //       wx.showToast({title: '发布成功！',icon: 'success', duration: 1500, mask:true})
    //       wx.switchTab({
    //         url: '/pages/shouye/index/index',
    //       })
    //     }
    //   },
    //   fail: (err) => {
    //     console.log(err)
    //   }
    // })
  },

  //获取已经选择了的标签
  getLabel(){
    var that = this
    var choosedLabels = []
    var labelList = this.data.indexlabels
    // console.log(labelList)
    for(let i=0;i<8;i++){
      if(labelList[i].isChoosed){
        choosedLabels.push(labelList[i].id)
      }
    }
    if(choosedLabels.length<1){
      wx.showToast({title: '标签不能为空！',icon: 'none', duration: 1500, mask: true,})
    }else if(choosedLabels.length>1){
      wx.showToast({title: '标签最多选一个！',icon: 'none', duration: 1500, mask: true,})
      return 0
    }else{
      that.setData({
        labels: choosedLabels,
      })
      // console.log(this.data.labels)
      return 1
    }
  },

  //获取是否紧急
  changeEmergency(e){
    var state = e.currentTarget.dataset.index
    this.setData({
      emergency: state,
    })
  },

  showOverlay: function () {
    this.setData({
      showOverlay: true
    });
  },

  hideOverlay: function () {
    this.setData({
      showOverlay: false
    });
  },

  // 标签改动
  changeLabel:function (e) {
    var index = e.currentTarget.dataset.index-1
    var labels = this.data.indexlabels
    labels[index].isChoosed = !labels[index].isChoosed
    this.setData({
      indexlabels: labels
    })
    // console.log(this.data.indexlabels)
  },

  //选择照片
  chooseImage:function (){
    var that = this
    var imageList = this.data.fileList
    if(imageList.length < 9){
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
                        fileList: imageList
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
              fileList: imageList
            });
            wx.showToast({title: '上传成功',icon: 'success',duration: 500, mask: true,})
          }
        }
      })
    }else{
      wx.showToast({
        title: '最多只能上传九张图片！',icon: 'none',duration: 1000, mask: true,
      })
    }
  },
  // 图片预览
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.fileList
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },
  // 删除照片
  deleteImage(e) {
    var index = e.currentTarget.dataset.index
    var imgData = this.data.fileList;
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确认删除则点击确定',
      success: function (res) {
        if (res.confirm) {
          imgData.splice(index, 1);
          that.setData({
              fileList: imgData
          })
        }
      }
    })
  },

  // 上传到服务器
  uploadImage(url) {
    console.log(1)
    let _name = url.split("\/");
    let name = _name[_name.length-1];
    name = name.length > 10 ? name.substring(name.length - 9, name.length) : name;
    let formData = new FormData();
    formData.appendFile("file",url,name);
    let data = formData.getData();
    console.log(data.buffer)
    wx.request({
      url: 'http://8.130.118.211:5795/common/file',
      header: {
        'content-type': data.contentType
      },
      data: data.buffer,
      success: function(res){
        console.log('上传成功')
        return 1
      },
      method: 'POST',
      fail(res){
        console.log(res)
        wx.showToast({title: '图片上传失败！',icon: 'error', duration:1500, mask:true})
        return 0
      }
    });
  }

})