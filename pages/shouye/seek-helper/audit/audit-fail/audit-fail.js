Page({
  data: {
    helpid: '', //求助记录id
    reason: '', //不通过原因
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
        // console.log(res)
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
        // console.log(res)
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
  // 获取不通过原因
  getreason(e){
    this.setData({reason:e.detail.value})
    console.log(this.data.reason)
  },
  // 点击提交
  submit(){
    var that = this
    var id = that.data.helpid
    var requestId = that.data.requestId
    var userId = that.data.userId
    wx.showModal({
      title: '确认不通过',
      content: '不通过则帮助者无法获得报酬益时',
      complete: (res) => {
        if (res.confirm) {
          if(!that.data.reason){
            wx.showToast({title: '不通过原因不能为空',icon:'none',duration:1500,})
            return 
          }
          var reason = that.data.reason
          wx.showLoading({title: '加载中...',})
          wx.request({
            url: 'http://8.130.118.211:5795/user/help',
            headers: {
              authentication : wx.getStorageSync('token')
            },
            data:{
              'status': 4,
              'requestId': requestId,
              'userId': userId,
              'id': id,
              'reason': reason,
            },
            method : 'PUT',
            success: (res) => {
              wx.hideLoading()
              console.log(res)
              if(res.data.code==1){
                wx.showToast({
                  title: '上传成功',
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
              wx.hideLoading()
              console.log(err)
            }
          })
        }
      }
    })
  }
})