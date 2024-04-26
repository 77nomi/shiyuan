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
    this.setData({records:[]})
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
      header: {
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
        // console.log(res.data)
        if(res.data.data){
          var newrecords = res.data.data.records
          var records = that.data.records
          records = records.concat(newrecords)
          that.setData({records:records})
        }
        if(!res.data.data && status!=0){
          wx.showToast({title: '暂无更多记录',icon:'none',duration:1500, mask: true,})
        }
        if(status==0){
          wx.showLoading({title: '加载中...',})
          wx.request({
            url: 'http://8.130.118.211:5795/user/request',
            header: {
              authentication : wx.getStorageSync('token')
            },
            data:{
              'id': id,
              'status': 4,
              'page': page,
              'pageSize': 10
            },
            method : 'GET',
            success: (res) => {
              wx.hideLoading()
              // console.log(res.data)
              if(res.data.data){
                var newrecords = res.data.data.records
                var records = that.data.records
                records = records.concat(newrecords)
                that.setData({records:records})
                console.log(that.data.records)
              }else{
                wx.showToast({title: '暂无更多记录',icon:'none',duration:1500, mask: true,})
              }
            }
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
      },
      complete:(res)=>{
        wx.hideLoading()
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
  
  getDetailTap:function (e) {
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/shouye/help-page-detail/help-page-detail?id='+e.currentTarget.dataset.index,
    })
  }
})