const api = require('../../utils/API')
var app = getApp()
let name='微信用户'
let image='https://img1.imgtp.com/2023/08/18/uFssqCH4.jpg'
Page({
  data: {
  },

  loginothers:function(e) {
    wx.login({
      success (res) {
        console.log(res)
        app.globalData.code = res.code
        app.globalData.openId = res.openId
        wx.request({
          url: "http://8.130.118.211:5795/user/user/login",
          data: {
            "code": app.globalData.code,
            "name": name,
            "image": image,
          },
          method: 'POST',
          success: (res) => {
            wx.showToast({ title: '登录成功!', icon: 'none', duration: 1500, mask: true, });
            console.log(res)
            app.openSocket()
            wx.setStorageSync ('token', res.data.data.token)
            wx.setStorageSync('id', res.data.data.id)
            wx.switchTab({
              url: '/pages/geren/geren',
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
      }
    })
  },

  login:function(e) {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success:(res)=>{
        wx.showLoading({
            title: '登录中'
        });
        console.log(res)
        name = res.userInfo.nickName
        image = res.userInfo.avatarUrl
        this.loginothers()
      },
      fail:()=>{
        wx.showToast({ title: '登录中', icon: 'loading', duration: 2000, mask: true, });
        this.loginothers()
      }
    })
  }
})