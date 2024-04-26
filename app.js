// app.js
App({
  globalData: {
    socketStatus: 'closed',
    code: null,
    openId: null,
    selfDatas: {
      avatar: '',
      name: '',
      id: '',
      yishi: '',
      credibility: '',
      helptimes: '',
    },
    user: "",
    haveOpenId: false,
    api: "http://8.130.118.211:5795",
  },

  onLaunch: function() {
    if(wx.getStorageSync('token')){
      this.getDot()
    }
  },
  //打开通信
  openSocket() { 
    var that = this;
    if (that.globalData.socketStatus != 'closed') {
      return 
    }
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      this.globalData.socketStatus = 'connected';
    })
    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      this.globalData.socketStatus = 'closed'
    })
    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      //把JSONStr转为JSON
      message = message.data.replace(" ", "");
      if (typeof message != 'object') {
        message = message.replace(/\ufeff/g, ""); //重点
        var jj = JSON.parse(message);
        message = jj;
      }
      console.log(message);
      wx.showTabBarRedDot({index: 2,});
    })
    // 打开信道
    wx.connectSocket({
      url: "wss://shiyuan.ink/ws/" +wx.getStorageSync('id'),
    })
  },
    
  //关闭信道
  closeSocket() {
    if (this.globalData.socketStatus === 'connected') {
      wx.closeSocket({
        success: () => {
          this.globalData.socketStatus = 'closed'
        }
      })
    }
  },

  // 获取红点
  getDot(){
    wx.hideTabBarRedDot({index: 2,})
    var that = this
    var id = wx.getStorageSync('id')
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: "http://8.130.118.211:5795/user/message",
      data: {
        id: id,
        type: 0,
        page: 1,
        pageSize: 1,
      },
      header:{
        'authentication': wx.getStorageSync('token'),
      },
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        // console.log(res)
        if(res.data.code==401){
          wx.removeStorageSync('token')
          return 
        }
        that.openSocket()
        if(res.data.data.records[0])
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,})
            return
          }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
        return 
      },
    })
    wx.request({
      url: "http://8.130.118.211:5795/user/message",
      data: {
        id: id,
        type: 1,
        page: 1,
        pageSize: 1,
      },
      header:{
        'authentication': wx.getStorageSync('token'),
      },
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        // console.log(res)
        if(res.data.data.records[0])
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,})
            return
          }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
        return 
      },
    })
    wx.request({
      url: "http://8.130.118.211:5795/user/message",
      data: {
        id: id,
        type: 2,
        page: 1,
        pageSize: 1,
      },
      header:{
        'authentication': wx.getStorageSync('token'),
      },
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        // console.log(res)
        if(res.data.data.records[0])
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,})
            return
          }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
        return 
      },
    })
    wx.request({
    url:'http://8.130.118.211:5795/common/notice',
    method:'GET',
    data:{
      'page': 1,
      'pageSize': 20
    },
    header: {
      authentication : wx.getStorageSync('token')
    },
    success: (res) => {
      wx.hideLoading()
      if(res.data.data.records[0])
        for(var i=0;i<res.data.data.records.length;i++)
          if(res.data.data.records[i].status==0){
            wx.showTabBarRedDot({index: 2,})
            return
          }
    },
    fail: (err) => {
      wx.hideLoading()
      console.log(err)
      return 
    },
    })
    wx.request({
      url:'http://8.130.118.211:5795/common/survey',
      method:'GET',
      data:{
        'page': 1,
        'pageSize': 20
      },
      header: {
        authentication : wx.getStorageSync('token')
      },
      success:(res) => {
        wx.hideLoading()
        if(res.data.data.records[0])
          for(var i=0;i<res.data.data.records.length;i++)
            if(res.data.data.records[0].status==0){
              wx.showTabBarRedDot({index: 2,})
              return
            }
      },
      fail:(err)=>{
        wx.hideLoading()
        console.log(err)
      }
    })
    wx.hideLoading()
  },
})
