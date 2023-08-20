Page({
  data: {
    msg:'',
    num:'',
    type1:0,
    type2:0,
   flag:'false',
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
    // 报错 userId is not defined
    userImage: '',
    userName: '',
  },
  onLoad(options) {
    // console.log(wx.getStorageSync('id'))
    this.setData({id:options.id})
    this.getDetailData(options.id)
    this.buttonStatus()
  },

  //获取详细信息
  getDetailData:function(id){
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
          id: data.id,
          image: data.image,
          reqNum: data.reqNum,
          reqTime: data.reqTime,
          status: data.status,
          title: data.title,
          userId: data.userId,
          userImage: data.userImage,
          userName: data.userName,
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

  // 查看图片
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.image
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },
  
buttonStatus:function(){
  console.log(10)
  if(this.data.userId===wx.getStorageSync('id')){
      flag:false;
}else{
  if(this.data.status===null){
    flag:true;
  }
  else if(this.data.status===1){
    type1=1;
    this.setData({
      msg:'已完成'
    })
       }
  else if(this.data.status===2){
        type1=1;
     this.setData({
           msg:'已被确认'
           })
  }
  else if(this.data.status===3){
    type1=1;
    this.setData({
      msg:'已取消'
    })
 }
 else if(this.data.status===5){
  type1=1;
  this.setData({ 
    msg:'已被取消'
  })
}
 else if(this.data.status===0){
type1=1;
this.setData({
  msg1:'取消帮助',
  msg2:'完成帮助'
})
}
  else if(this.data.status===4){
type2=2;
this.setData({
  msg1:'取消帮助',
  msg2:'重新上传'
})
}
  }
}

  
})

