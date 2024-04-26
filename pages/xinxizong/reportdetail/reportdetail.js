Page({
  data: {
    adminId:'',
    id: '',
    content: '',
    userId:'',
    reportId:'',
    requestId:'',
    title:'',
    image: '',
    reason: '',
  },
  onLoad(options) {
    this.getDetailData(options.id)
  },

  //获取详细信息
  getDetailData:function(id){
    var that = this
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/user/report/' + id,
      header: {
        authentication : wx.getStorageSync('token')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
          var data = res.data.data
          that.setData({
            adminId:data.adminId,
            content: data.content,
            reportId: data.reportId,
            id: data.id,
            image: data.image,
            title: data.title,
            requestId: data.requestId,
            reason: data.reason,
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

  // 查看图片
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.image
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },

  toyuanpost:function(){
    wx.navigateTo({
      url: '/pages/shouye/help-page-detail/help-page-detail?id='+this.data.requestId
    })
  },


})