var app = getApp()
Page({

  data: {
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
      indextabs
    })
    this.getforms(e.detail.index,1)
  },

  getforms:function (label,page) {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: "http://8.130.118.211:5795/user/request/list",
      data: {
        'label': label,
        'page': page,
        'pageSize': 5,
      },
      // header:{
      //   'authentication': token,
      // },
      method: 'GET',
      success: (res) => {
        // console.log(res)
        that.setData({helplist:res.data.data.records})
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
 
  onLoad(options) {
    this.getforms(0,1)
  },

  getDetailTap:function (e) {
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/shouye/help-page-detail/help-page-detail?id='+e.currentTarget.dataset.index,
    })
  }
})