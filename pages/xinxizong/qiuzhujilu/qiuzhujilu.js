// pages/qiuzhujilu/qiuzhujilu.js
Page({
  data: {
    helplist:[],
    isloading:false,
    page: 1,
  },

  onLoad(options) {
    this.getSeekDatas()
  },

  getSeekDatas:function(){
    var that = this
    var page = this.data.page
    var id = wx.getStorageSync('id')
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: "http://8.130.118.211:5795/common/request",
      data: {
        page: page,
        pageSize: 10,
        userId: id,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.data.records[0]){
          var helpList = that.data.helplist
          var newrecords = res.data.data.records
          var finrecord = helpList.concat(newrecords)
          that.setData({helplist:finrecord})
        }else{
          wx.showToast({title: '暂无更多记录',icon: 'none', duration: 1500})
        }
      },
      fail: (err) => {
        console.log(err)
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },

  getMore:function(){
    this.setData({page:this.data.page+1})
    this.getSeekDatas()
  },

  getDetailTap:function (e) {
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/shouye/help-page-detail/help-page-detail?id='+e.currentTarget.dataset.index,
    })
  }
})