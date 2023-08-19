// app.js
App({
  globalData: {
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
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
})
