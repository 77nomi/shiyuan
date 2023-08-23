const app = getApp()
Page({
  data: {
    type0: 0,
    type1: 0,
    type2: 0,
  },

  onLoad(){
    var type0 = app.globalData.type0Num
    var type1 = app.globalData.type1Num
    var type2 = app.globalData.type2Num
    this.setData({type0:type0,type1:type1,type2:type2,})
  },
  onShow() {
    app.hideTabBarBadge()
  },

  // 官方通知
  officialNotice(){
    this.setData({type2:0})
    app.globalData.type2=0
    wx.navigateTo({
      url: '/pages/xinxizong/guanfangtongzhi/guanfangtongzhi',
    })
  },
  // 求助信息
  seekHelpInfo(){
    this.setData({type0:0})
    app.globalData.type0=0
    wx.navigateTo({
      url: '/pages/xinxizong/qiuzhuxinxi/qiuzhuxinxi?type=0',
    })
  },
  // 求助记录
  seekHelpRecord(){
    wx.navigateTo({
      url: '/pages/xinxizong/qiuzhujilu/qiuzhujilu',
    })
  },
  // 帮助信息
  helpInfo(){
    this.setData({type1:0})
    app.globalData.type1=0
    wx.navigateTo({
      url: '/pages/xinxizong/bangzhuxinxi/bangzhuxinxi?type=1',
    })
  },
  // 帮助记录
  helpRecord(){
    wx.navigateTo({
      url: '/pages/xinxizong/bangzhujilu/bangzhujilu',
    })
  },
})