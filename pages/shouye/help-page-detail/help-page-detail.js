Page({
  data: {
    bonus: '',
    comNum: '',
    contact: '',
    content: '',
    createTime: '',
    credit: '',
    endTime: '',
    helpId: '',
    helpNum: '',
    id: '',
    image: '',
    reqNum: '',
    reqTime: '',
    status: '',
    title: '',
    userImage: '',
    userName: '',
  },
  onLoad(options) {
    this.setData({id:options.id})
    this.getDetailData(options.id)
  },

  getDetailData:function(id){
    var that = this
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795//common/request/' + id,
      headers: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'userId': wx.getStorageSync('id')
      },
      method : 'GET',
      success: (res) => {
        console.log(res)
        var data = res.data.data
        that.setData({
          bonus: data.bonus,
          comNum: data.comNum,
          contact: data.contact,
          content: data.content,
          createTime: data.createTime,
          credit: data.credit,
          endTime: data.endTime,
          helpId: data.helpId,
          helpNum: data.helpNum,
          id: data.id,
          image: data.image,
          reqNum: data.reqNum,
          reqTime: data.reqTime,
          status: data.status,
          title: data.title,
          userImage: data.userImage,
          userName: data.userName,
        })
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