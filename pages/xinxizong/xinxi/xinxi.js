const app = getApp()
Page({
  data: {
    type0: 0,
    type1: 0,
    type2: 0,
    type3: 0,
  },

  getToken(){
    if(!wx.getStorageSync('token')){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }else{
      var id = wx.getStorageSync('id')
      var token = wx.getStorageSync('token')
      wx.request({
        url: 'http://8.130.118.211:5795/user/user/' + id,
        header:{
          'authentication': token
        },
        method : 'GET',
        success: (res) => {
          // console.log(res)
          wx.hideLoading()
          var status = res.data.data.status
          if(status != 0){
            wx.removeStorageSync('token')
            wx.reLaunch({url: '/pages/login/login',})
          }
        },
        fail: (err) => {
          wx.hideLoading()
          console.log(err)
        }
      })
    }
  },

  onShow() {
    this.getToken()
    wx.hideTabBarRedDot({index: 2,})
    this.setData({type0:0,type1:0,type2:0,type3:0})
    this.getDot()
  },
  

  // 获取红点
  getDot(){
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
        // console.log(res)
        if(res.data.data.records[0])
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,});
            that.setData({type0:1})
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
        if(res.data.data.records[0])
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,});
            that.setData({type1:1})
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
        if(res.data.data.records[0])
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,});
            that.setData({type2:1})
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
        for(var i=0;i<res.data.data.records.length;i++){
          if(res.data.data.records[0].status==0){
            wx.showTabBarRedDot({index: 2,});
            that.setData({type3:1})
            return 
          }
        }
    },
    fail: (err) => {
      wx.hideLoading()
      console.log(err)
      return 
    },
    })
    if(this.data.type3==0)
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
            for(var i=0;i<res.data.data.records.length;i++){
              if(res.data.data.records[i].status==0){
                wx.showTabBarRedDot({index: 2,});
                that.setData({type3:1})
                break
              }
            }
        },
        fail:(err)=>{
          wx.hideLoading()
          console.log(err)
        }
      })
  },

  // 官方通知
  officialNotice(){
    wx.navigateTo({
      url: '/pages/xinxizong/guanfangtongzhi/guanfangtongzhi',
    })
  },
  // 求助信息
  seekHelpInfo(){
    wx.navigateTo({
      url: '/pages/xinxizong/qiuzhuxinxi/qiuzhuxinxi',
    })
  },
  // 帮助信息
  helpInfo(){
    wx.navigateTo({
      url: '/pages/xinxizong/bangzhuxinxi/bangzhuxinxi',
    })
  },
  //举报信息
  reportInfo(){
    wx.navigateTo({
      url: '/pages/xinxizong/reportinfo/reportinfo',
    })
  },
})