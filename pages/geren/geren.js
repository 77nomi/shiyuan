var app = getApp();
Page({
  data: {
    isShow:0,
    selfdatas:{
      avatar: '',
      name: '',
      id: '',
      yishi: '',
      credibility: '',
      helptimes: ''
    }
  },

  onShow(options) {
    this.setData({isShow:0,})
    this.getToken()
  },

  show(){
    this.setData({
      isShow:1
    })
  },
  hide(){
    this.setData({
     isShow:0
    })},

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
  cheakmyreport(){
    wx.navigateTo({
      url: '/pages/xinxizong/reportjilu/reportjilu',
    })
  },
  logout(){
    wx.request({
      url: 'http://8.130.118.211:5795/user/user/logout',
      header: {
        'authentication' : wx.getStorageSync('token')
      },
      method : 'POST',
      success: (res) => {
        // console.log(res)
        app.closeSocket()
        wx.removeStorageSync('token')
        wx.removeStorageSync('id')
        wx.removeStorageSync('isLogin')
        wx.reLaunch({
          url: '/pages/login/login',
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  changeDetail(){
    wx.navigateTo({
      url: '/pages/login/login?flag=1',
    })
  }
})