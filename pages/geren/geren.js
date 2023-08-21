const api = require('../../utils/API')
var app = getApp();
Page({
  data: {
    selfdatas:{
      avatar: '',
      name: '',
      id: '',
      yishi: '',
      credibility: '',
      helptimes: ''
    }
  },

  onLoad(options) {
    this.getToken()
  },

  async getToken() {
    let token = wx.getStorageSync('token')
    if(!token){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }else{
      var id = wx.getStorageSync('id')
      wx.request({
        url: 'http://8.130.118.211:5795/user/user/' + id,
        headers: {
          authentication : wx.getStorageSync('token')
        },
        method : 'GET',
        success: (res) => {
          console.log(res)
          var datas={
            avatar: res.data.data.image,
            name: res.data.data.name,
            id: res.data.data.id,
            yishi: res.data.data.time,
            credibility: res.data.data.credit,
            helptimes: res.data.data.help
          }
          this.setData({
            selfdatas: datas
          })
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }
  },

  cheakmyseek(){
    wx.navigateTo({
      url: '/pages/xinxizong/qiuzhujilu/qiuzhujilu',
    })
  },
  cheakmyhelp(){
    wx.navigateTo({
      url: '/pages/xinxizong/bangzhujilu/bangzhujilu',
    })
  },
  logout(){
    wx.request({
      url: 'http://8.130.118.211:5795/user/user/logout',
      headers: {
        token : wx.getStorageSync('token')
      },
      method : 'POST',
      success: (res) => {
        console.log(res)
        wx.removeStorageSync('token')
        this.onLoad()
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

})