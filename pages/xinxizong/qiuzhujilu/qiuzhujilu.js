// pages/qiuzhujilu/qiuzhujilu.js
Page({
  data: {
    helplist:[],
  },

  onLoad(options) {
    this.getSeekDatas(1)
  },

  getSeekDatas:function(page){
    var that = this
    var id = wx.getStorageSync('id')
    wx.request({
      url: "http://8.130.118.211:5795/common/request",
      data: {
        page: page,
        pageSize: 5,
        userId: id,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.data.records){
          var records = res.data.data.records
          that.setData({helplist:records})
        }else{wx.showToast({
            title: '暂无更多记录',icon: 'none', duration: 1500})
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})