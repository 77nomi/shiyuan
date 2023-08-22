Page({
  data: {
    id: '',
    page:1,
    records: [],
  },

  onLoad(options) {
    this.setData({id:options.id})
    this.getRecords()
  },

  getRecords(){
    var that = this
    var id = this.data.id
    var page = this.data.page
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/user/help',
      headers: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'id': id,
        'page': page,
        'pageSize': 10
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },

})