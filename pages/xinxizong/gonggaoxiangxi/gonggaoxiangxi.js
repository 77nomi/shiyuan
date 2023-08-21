// pages/admin/shouyezong/gonggaoxiangxi/gonggaoxiangxi.js
Page({
  data: {
    'title': '',
    'content': '',
    'image': '',
    'adminId': '',
  },

  onLoad(options) {
    const {id}=options;
    this.getnoticedetails(id);
  },

  getnoticedetails(id){
    wx.showLoading({title: '加载中',})
    var that = this
    wx.request({
    url:'http://8.130.118.211:5795/common/notice/'+id,
    method:'GET',
    success:(res) => {
      wx.hideLoading()
      var data = res.data.data
      console.log(data)
      var content = data.content
      var image = data.image
      var title = data.title
      var adminId = data.adminId
      that.setData({
        'title': title,
        'content': content,
        'image': image,
        'adminId': adminId,
      })
    },
    fail:(err)=>{
      console.log(err)
    }
    })
  },
})