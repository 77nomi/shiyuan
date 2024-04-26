Page({
  data: {
    flag: 1,
    adminId: '',
    adminImage: '',
    adminName: '',
    bonus: '',
    comNum: '',
    content: '',
    createTime: '',
    id: '',
    image: '',
    title: '',
  },
  onLoad(options) {
    if(!wx.getStorageSync(options.id))
      this.setData({flag:0})
    this.setData({id:options.id})
    this.getDetailData(options.id)
  },

  //获取详细信息
  getDetailData:function(id){
    var that = this
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/survey/' + id,
      data:{
        status: 0,
      },
      header: {
        authentication : wx.getStorageSync('token')
      },
      method : 'GET',
      success: (res) => {
        // console.log(res)
        if(res.data.code==1){
          var data = res.data.data
          that.setData({
            adminId: data.adminId,
            adminImage: data.adminImage,
            adminName: data.adminName,
            bonus: data.bonus,
            comNum: data.comNum,
            content: data.content,
            createTime: data.createTime,
            id: data.id,
            image: data.image,
            title: data.title,
          })
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

  // 查看图片
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.image
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },

  // 完成问卷
  complete(){
    var that = this
    wx.showModal({
      title: '请确认已经完成',
      content: '若未完成则有概率收回奖励益时',
      complete: (res) => {
        if (res.confirm) {
          var id = that.data.id
          var userid = wx.getStorageSync('id')
          var bonus = parseInt(that.data.bonus)
          wx.showLoading({title: '加载中...',})
          wx.request({
            url: 'http://8.130.118.211:5795/user/survey?id='+id+'&userId='+userid+'&bonus='+bonus,
            header: {
              "authentication" : wx.getStorageSync('token')
            },
            method: 'PUT',
            success: (res) => {
              wx.hideLoading()
              // console.log(res)
              if(res.data.code==1){
                wx.showToast({
                  title: '已完成！',
                  icon: 'success', 
                  duration: 1500, 
                  mask: true,
                  success: function () {
                    wx.hideLoading()
                    wx.setStorageSync(id, 1)
                    setTimeout(function () {
                    wx.reLaunch({
                    url: '/pages/xinxizong/guanfangtongzhi/guanfangtongzhi',
                      })
                    }, 1500);}
                })
              }else{
                wx.showToast({title: res.data.msg,icon:'none',duration:1500, mask: true,})
              }
            },
            fail: (err) => {
              wx.hideLoading()
              console.log(err)
            },
          })
        }
      }
    })
  },

})