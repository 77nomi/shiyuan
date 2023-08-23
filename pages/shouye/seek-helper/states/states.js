Page({
  data: {
    id: '',
    page:1,
    records: [],
    createTime: '',
  },

  onLoad(options) {
    this.setData({id:options.id,records:[]})
    this.getRecords()
    this.getDetailData()
  },

  //获取详细信息
  getDetailData:function(){
    var id = this.data.id
    var that = this
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/request/' + id,
      headers: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'userId': wx.getStorageSync('id')
      },
      method : 'GET',
      success: (res) => {
        // console.log(res)
        var data = res.data.data
        that.setData({
          createTime: data.createTime,
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
  // 获取帮助记录
  getRecords(){
    var that = this
    var id = this.data.id
    var page = this.data.page
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/user/help',
      headers: {
        authentication : wx.getStorageSync('token')
      },
      data:{
        'id': id,
        'page': page,
        'pageSize': 10
      },
      method : 'GET',
      success: (res) => {
        // console.log(res)
        if(res.data.data.records[0]){
          var oldrecords = that.data.records
          var newrecords = res.data.data.records
          newrecords = oldrecords.concat(newrecords)
          that.setData({records:newrecords})
        }else{
          wx.showToast({title: '暂无更多记录',icon: 'none', duration: 1500, mask: true,})
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
  // 触底刷新
  getMore(){
    this.setData({page:this.data.page+1})
    this.getRecords()
  },
  // 取消他人帮助
  cancelHelp(e){
    var datas = e.currentTarget.dataset.datas
    if(!datas.dl)
      wx.showToast({title: '对方帮助您还未满12小时，您无法取消',duration: 2000, icon: 'none'})
    // console.log(datas)
    var that = this
    var requestId = this.data.id
    var userId = datas.userId
    var id = datas.id
    wx.showModal({
      title: '确认取消',
      content: '取消后对方不可再次帮助您',
      complete: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '加载中...',})
          wx.request({
            url: 'http://8.130.118.211:5795/user/help',
            headers: {
              authentication : wx.getStorageSync('token')
            },
            data:{
              'id': id,
              'status': 5,
              'requestId': requestId,
              'userId': userId,
            },
            method : 'PUT',
            success: (res) => {
                console.log(res)
              if(res.code==1){
                that.onloadThisPage()
              }else{
                wx.showToast({title: res.data.msg,duration: 2000, icon: 'none'})
              }
            },
            fail: (err) => {
              wx.hideLoading()
              wx.showToast({title: err.data.data.msg})
              console.log(err)
            },
            complete:()=>{
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  // 审核他人帮助
  confirmHelp(e){
    var datas = e.currentTarget.dataset.datas
    var that = this
    console.log(datas)
    wx.navigateTo({
      url: '/pages/shouye/seek-helper/audit/audit?helpid='+datas.id,
    })
  },

  //带参数刷新当前页面
  onloadThisPage(){
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1] //当前页面
    const keyList = Object.keys(perpage.options) //当前页面携带的路由参数
                          
    if(keyList.length > 0){
       let keys = '?'
        keyList.forEach((item, index) =>{ 
            index === 0 ? 
             keys = keys + item + '=' + perpage.options[item] : keys = keys + '&' + item + '=' + perpage.options[item] })
             wx.reLaunch({
                url: '/' + perpage.route + keys
             })
        }else{
             wx.reLaunch({
                 url: '/' + perpage.route //当前页面路由地址
              })
    }
  }
})