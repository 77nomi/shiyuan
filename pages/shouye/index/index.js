// pages/shiyuanguangchang/shiyuanguangchang.js
Page({

  /**
   * 页面的初始数据
   */

  data: {
    helplist:[
      {
        label: '问卷',
        title: '求助帮忙填问卷',
        name: 'czx',
        x: '1',
        n: '5',
        time: "2023年8月18日9:01"
      },{
        label: '问卷',
        title: '求助帮忙填问卷',
        name: 'czx',
        x: '1',
        n: '5',
        time: "2023年8月18日9:01"
      },{
        label: '问卷',
        title: '求助帮忙填问卷',
        name: 'czx',
        x: '1',
        n: '5',
        time: "2023年8月18日9:01"
      }
    ],
    indextabs:[
      {
        id:0,
        value:"最新",
        isActive:true
      },
      {
        id:1,
        value:"紧急",
        isActive:false
      },
      {
        id:2,
        value:"提问",
        isActive:false
      },
      {
        id:3,
        value:"投票",
        isActive:false
      },
      {
        id:4,
        value:"问卷",
        isActive:false
      },
      {
        id:5,
        value:"跑腿",
        isActive:false
      },
      {
        id:6,
        value:"其他",
        isActive:false
      }
    ]

  },
  handleTabsItemChange(e){
    //获取被点击事件的标题索引
    const {index}=e.detail;
    //修改数组
    let{indextabs}=this.data;
    indextabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      indextabs
    })
      },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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