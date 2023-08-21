Page({
  data: {
    adminId: '',
    adminImage: '',
    adminName: '',
    bonus: '',
    comNum: '',
    content: '',
    createTime: '',
    id: '',
    image: '',
    title: '',
  },
  onLoad(options) {
    this.setData({id:options.id})
    this.getDetailData(options.id)
  },

  //获取详细信息
  getDetailData:function(id){
    var that = this
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/survey/' + id,
      headers: {
        token : wx.getStorageSync('token')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
          var data = res.data.data
          that.setData({
            adminId: data.adminId,
            adminImage: data.adminImage,
            adminName: data.adminName,
            bonus: data.bonus,
            comNum: data.comNum,
            content: data.content,
            createTime: data.createTime,
            id: data.id,
            image: data.image,
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

  // 查看图片
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.image
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },
})