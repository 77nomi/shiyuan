Page({
  data: {
    msg:'',
    msg1: '',
    msg2: '',
    num:'',
    type: 0,
    flag: false,
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
    userId: '',
    userImage: '',
    userName: '',
  },

  onLoad(options) {
    if(options)
      this.setData({id:options.id})
    this.setData({flag:false,type:0})
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
          image: data.image,
          reqNum: data.reqNum,
          reqTime: data.reqTime,
          status: data.status,
          title: data.title,
          userId: data.userId,
          userImage: data.userImage,
          userName: data.userName,
        })
        this.buttonStatus()
      },
      fail: (err) => {
        console.log(err)
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },

  // 查看原帖帮助记录
  getStatus(){
    var that = this
    if(this.data.userId == wx.getStorageSync('id')){
      wx.navigateTo({
        url: '/pages/shouye/seek-helper/states/states?id='+that.data.id,
      })
    }
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

  // 按钮状态
  buttonStatus:function(){
    var id = wx.getStorageSync('id')
    var status = this.data.status
    if(this.data.userId == id){
      this.setData({flag:false,type:0})
    }else{
      if(status=='0'){
        this.setData({flag:false,type:2,msg1:'取消帮助',msg2:'完成帮助'})
      }
      else if(!status){
        this.setData({flag:true,type:0})
      }
      else if(status===1){
        this.setData({flag:false,type:1,msg:'待求助者确认'})
      }
      else if(status===2){
        this.setData({flag:false,type:1,msg:'已确认'})
      }
      else if(status===3){
        this.setData({flag:false,type:1,msg:'已取消'})
      }
      else if(status===5){
        this.setData({flag:false,type:1,msg:'已被取消'})
      }
      else if(status===4){
        this.setData({flag:false,type:2,msg1:'取消帮助',msg2:'重新上传'})
      }
    }
  },
  // 立即帮助
  help(){
    var that = this
    var requestId = this.data.id
    var userId = wx.getStorageSync('id')
    var bonus = this.data.bonus
    wx.showModal({
      title: '确认帮助',
      complete: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '加载中...',})
          wx.request({
            url: 'http://8.130.118.211:5795/user/help',
            headers: {
              authentication : wx.getStorageSync('token')
            },
            data:{
              'status': 0,
              'requestId': requestId,
              'userId': userId,
              'bonus': bonus,
            },
            method : 'PUT',
            success: (res) => {
              console.log(res)
              that.onLoad()
            },
            fail: (err) => {
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
  //取消帮助
  cancelHelp(){
    var that = this
    var requestId = this.data.id
    var userId = wx.getStorageSync('id')
    var bonus = this.data.bonus
    var id = this.data.helpId
    wx.showModal({
      title: '确认取消',
      content: '取消后不可再次帮助',
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
              'status': 3,
              'requestId': requestId,
              'userId': userId,
              'bonus': bonus,
            },
            method : 'PUT',
            success: (res) => {
              console.log(res)
              that.onLoad()
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
  // 完成帮助
  completeHelp(){
    var id = this.data.id
    wx.navigateTo({url: '/pages/shouye/helper/complete/complete?id='+id,})
  },

  //点击更多
  more(){
    var that = this
    if(this.data.userId != wx.getStorageSync('id')){
      wx.showActionSheet({
        itemList: ['举报'],
        success: function (res) {
          if (!res.cancel) {
            wx.navigateTo({
              url: '/pages/shouye/helper/report/report?id='+that.data.id,
            })
          }
        }
      })
    }else{
      wx.showActionSheet({
        itemList: ['编辑','删除'],
        success: function (res) {
          if (!res.cancel) {
            if(res.tapIndex==0){
              wx.navigateTo({
                url: '/pages/shouye/seek-helper/edit/edit?id='+that.data.id,
              })
            }else{
              if(that.data.comNum!=that.data.helpNum)
                wx.showToast({title: '有未确认的帮助记录',icon: 'none',duration:1500})
              else
                wx.showModal({
                  title: '确认删除',
                  content: '点击确认后即删除',
                  success: function (res) {
                    if (res.confirm) {
                      that.delete()
                    }
                  }
                })
            }
          }
        }
      })
    }
  },
  // 删除求助
  delete(){
    wx.showLoading({title: '加载中...',})
    var id = this.data.id
    var that = this
    wx.request({
      url: 'http://8.130.118.211:5795/common/request/' + id,
      headers: {
        authentication : wx.getStorageSync('token')
      },
      method : 'DELETE',
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          title: '删除成功！',duration:1500,
          success: function () {
            setTimeout(function () {
            wx.reLaunch({
            url: '/pages/shouye/index/index',
              })
            }, 1500);}
        })
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
      },
    })
  },
})

