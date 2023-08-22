// pages/bangzhujilu/bangzhujilu.js
Page({
  data: {
    status: 0,
    records: [],
    page: 1,
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
 
  onLoad(options) {
    this.getRecords()
  },

  getRecords(){
    var that = this
    var id = wx.getStorageSync('id')
    var status = this.data.status
    var page = this.data.page
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/user/request',
      headers: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'id': id,
        'status': status,
        'page': page,
        'pageSize': 10
      },
      method : 'GET',
      success: (res) => {
        wx.hideLoading()
        var newrecords = res.data.data.records
        console.log(newrecords)
        if(newrecords[0]){
          var records = that.data.records
          records = records.concat(newrecords)
          that.setData({records:records})
        }
        else{
          wx.showToast({title: '暂无更多记录',icon:'none',duration:1500})
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
        wx.showToast({title: '暂无更多记录',icon:'none',duration:1500})
      },
    })
  },
  
  getMore:function(){
    this.setData({page:this.data.page+1})
    this.getRecords()
  },

  handleTabsItemChange(e){
    //获取被点击事件的标题索引
    const {index}=e.detail;
    console.log(index)
    //修改数组
    let{tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
    if(index==0)
      this.setData({status:0})
    else if(index==1)
      this.setData({status:1})
    else if(index==2)
      this.setData({status:2})
    this.setData({records:[],page:1})
    this.getRecords()
  },
})