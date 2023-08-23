Page({

  data: {
    id: '',
    type: '',
    page: 1,
    records: [],
  },

  onLoad(options) {
    this.setData({type:options.type})
    this.getrecords()
  },

  getrecords(){
    var that = this
    var id = wx.getStorageSync('id')
    var type = that.data.type
    var page = that.data.page
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: "http://8.130.118.211:5795/user/message",
      data: {
        id: id,
        type: type,
        page: page,
        pageSize: 10,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.data.records[0]){
          var records = that.data.records
          var newrecords = res.data.data.records
          var finrecord = records.concat(newrecords)
          that.setData({records:finrecord})
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

  getMore(){
    this.setData({page:this.data.page+1})
    this.getrecords()
  },

  gotoDetail(e){
    var index = e.currentTarget.dataset.index
    var id = this.data.records[index].id
    wx.navigateTo({
      url: '/pages/xinxizong/infoDetail/infoDetail?id='+id,
    })
  },
})