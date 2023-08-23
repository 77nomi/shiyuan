Page({
  data: {
    id: '',
    content: '',
    createTime: '',
    title: '',
  },

  onLoad(options) {
    this.setData({id:options.id})
    this.getDetailData()
  },

  //获取详细信息
  getDetailData:function(){
    var that = this
    var id = this.data.id
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/user/message/' + id,
      headers: {
        token : wx.getStorageSync('token')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
          var data = res.data.data
          that.setData({
            content: data.content,
            createTime: data.createTime,
            title: data.title,
          })
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
})