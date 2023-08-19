// pages/bangzhujilu/bangzhujilu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"待完成",
        isActive:true
      },
      {
        id:1,
        value:"待确认",
        isActive:false
      },
      {
        id:2,
        value:"已确认",
        isActive:false
      }
    ]

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 标题点击事件
  handleTabsItemChange(e){
//获取被点击事件的标题索引
const {index}=e.detail;
//修改数组
let{tabs}=this.data;
tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
this.setData({
  tabs
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