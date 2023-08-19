// pages/qiuzhujilu/qiuzhujilu.js
Page({
  data: {

  },

  getSeekDatas(){
    wx.request({
      url: "http://8.130.118.211:5795/user/request/list",
      data: {
        'key': null,
        'label': label,
        'page': page,
        'pageSize': 5,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  onLoad(options) {
    getSeekDatas()
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