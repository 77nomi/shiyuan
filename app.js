// app.js
App({
  globalData: {
    webSocketNum: 0,// 记录webSocket的数据条数
    type0Num: 0, //我的求助信息
    type1Num: 0, //我的帮助信息
    type2Num: 0, //我的举报信息
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
    isLogin: false,
    haveOpenId: false,
    api: "http://8.130.118.211:5795",
  },
  onLaunch: function() {
    if(wx.getStorageSync('token'))
      this.openSocket()
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
      that.globalData.webSocketNum = that.globalData.webSocketNum+1
      wx.setTabBarBadge({
        index: 2,
        text: String(that.globalData.webSocketNum)
      });
      if(message.type===0)
        that.globalData.type0Num = that.globalData.type0Num+1
      else if(message.type===1)
        that.globalData.type1Num = that.globalData.type1Num+1
      else if(message.type===2)
        that.globalData.type1Num = that.globalData.type1Num+1
    })
    // 打开信道
    wx.connectSocket({
      url: "ws://8.130.118.211:5795/ws/" +wx.getStorageSync('id'),
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
  // 关闭信息红点
  hideTabBarBadge(){
    this.globalData.webSocketNum=0
    wx.removeTabBarBadge({
      index: 2,
    });
  },
})
