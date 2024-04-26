// pages/fabu/fabu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  tianxie(){
    wx.navigateTo({
      url:"/pages/fabuzong/tianxie/tianxie"
    });
  },
  onLoad(){
    this.getToken()
  },

  async getToken() {
    var that = this
    wx.showLoading({title: '加载中',})
    var token = wx.getStorageSync('token')
    if(!token){
      wx.hideLoading()
      wx.redirectTo({url: '/pages/login/login',})
    }else{
      var id = wx.getStorageSync('id')
      wx.request({
        url: 'http://8.130.118.211:5795/user/user/' + id,
        header:{
          'authentication': token
        },
        method : 'GET',
        success: (res) => {
          // console.log(res)
          wx.hideLoading()
          if(res.statusCode==401){
            wx.removeStorageSync('token')
            wx.reLaunch({url: '/pages/login/login',})
          }else{
            var datas={
              'avatar': res.data.data.image,
              'name': res.data.data.name,
              'id': res.data.data.id,
              'yishi': res.data.data.time,
              'credibility': res.data.data.credit,
              'helptimes': res.data.data.help
            }
            that.setData({
              selfdatas: datas
            })
          }
        },
        fail: (err) => {
          wx.hideLoading()
          console.log(err)
        }
      })
    }
  },
})