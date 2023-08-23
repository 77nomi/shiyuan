Page({
  data: {
    helpid: '', //求助记录id
    image: '', //完成图片
    content: '',  //完成描述
    requestId: '', //求助帖id
    userId: '', //帮助者id
    userName: '', //帮助者名称
    userImage: '', //帮助者头像
  },

  onLoad(options) {
    this.setData({helpid:options.helpid})
    this.getDetails()
  },

  // 根据帮助记录id获取帮助记录信息
  getDetails(){
    var helpid = this.data.helpid
    var that = this
    wx.request({
      url: 'http://8.130.118.211:5795/user/help/'+helpid,
      header: {
        'content-type': 'application/json',
        "authentication" : wx.getStorageSync('token')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
          var datas = res.data.data
          that.setData({
            content:datas.content,
            image:datas.image,
            requestId:datas.requestId,
            userId:datas.userId
          })
          that.getUser()
        }else{
          wx.showToast({title: res.data.msg,duration:1500,icon: 'error'})
          console.log(res)
        }
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },
  //根据帮助者id获得帮助者信息 
  getUser(){
    var that = this
    var id = that.data.userId
    wx.request({
      url: 'http://8.130.118.211:5795/user/user/' + id,
      headers: {
        authentication : wx.getStorageSync('token')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.code==1)
          this.setData({
            userImage: res.data.data.image,
            userName: res.data.data.name
          })
        else{
          wx.showToast({title: res.data.msg,duration:1500,icon: 'error'})
          console.log(res)
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 查看图片
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.image
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },
  // 通过审核
  passHelp(){
    var that = this
    var id = that.data.helpid
    var requestId = that.data.requestId
    var userId = that.data.userId
    wx.showModal({
      title: '确认通过',
      content: '通过后帮助者即可获得报酬益时',
      complete: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '加载中...',})
          wx.request({
            url: 'http://8.130.118.211:5795/user/help',
            headers: {
              authentication : wx.getStorageSync('token')
            },
            data:{
              'status': 2,
              'requestId': requestId,
              'userId': userId,
              'id': id,
            },
            method : 'PUT',
            success: (res) => {
              console.log(res)
              if(res.data.code==1){
                wx.showToast({
                  title: '已通过！',
                  icon: 'success', 
                  duration: 1500, 
                  success: function () {
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '/pages/shouye/help-page-detail/help-page-detail?id='+requestId,
                      })
                    }, 1500);}
                })
              }
              else
                wx.showToast({title: res.data.msg,icon:'none',duration:1500})
            },
            fail: (err) => {
              console.log(err)
            },
            complete:()=>{
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  // 不通过审核
  rejectHelp(){
    var helpid = this.data.helpid
    wx.navigateTo({
      url: '/pages/shouye/seek-helper/audit/audit-fail/audit-fail?helpid='+helpid,
    })
  },
})