var app = getApp()
Page({
  data: {
    nowLabel: 0,
    page: 1,
    helplist:[],
    indextabs:[
      {
        id:0,
        value:"紧急",
        isActive:true
      },
      {
        id:1,
        value:"问卷",
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
        value:"跑腿",
        isActive:false
      },
      {
        id:5,
        value:"失物招领",
        isActive:false
      },
      {
        id:6,
        value:"租借",
        isActive:false
      },
      {
        id:7,
        value:"出/收物",
        isActive:false
      },
      {
        id:8,
        value:"其它",
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
      indextabs,
      nowLabel:index,
      page:1
    })
    this.changeLabelGet(e.detail.index,1)
  },


  //获取&增加表单信息
  getforms:function () {
    var that = this
    var label = that.data.nowLabel
    var page = that.data.page
    console.log(page)
    var token = wx.getStorageSync('token')
    wx.showLoading({title: '加载中',})
    wx.request({
      url: "http://8.130.118.211:5795/user/request/list",
      data: {
        'label': label,
        'page': page,
        'pageSize': 10,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        console.log(res)
        wx.hideLoading()
        if(res.data.data.records){
          var helpList = that.data.helplist
          var newrecords = res.data.data.records
          var finrecord = helpList.concat(newrecords)
          that.setData({helplist:finrecord})
        }else{
          that.setData({helplist:[]})
          wx.showToast({title: '暂无更多记录',icon: 'none', duration: 1500})
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },

  //改变标签后获取信息
  changeLabelGet(){
    wx.showLoading({title: '加载中...',})
    var that = this
    var label = that.data.nowLabel
    var page = that.data.page
    var token = wx.getStorageSync('token')
    wx.request({
      url: "http://8.130.118.211:5795/user/request/list",
      data: {
        'label': label,
        'page': page,
        'pageSize': 10,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        if(res.data.data.records){
          that.setData({helplist:res.data.data.records})
        }else{
          wx.showToast({title: '暂无更多记录',icon: 'none', duration: 1500})
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },

  getMore(){
    this.setData({
      page:this.data.page+1
    })
    this.getforms()
  },

  onLoad(options) {
    this.getforms(0,1)
  },

  getDetailTap:function (e) {
    // console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/shouye/help-page-detail/help-page-detail?id='+e.currentTarget.dataset.index,
    })
  }
})