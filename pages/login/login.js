const FormData = require('../../utils/formdata.js')
const defaultAvatarUrl = 'http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
var app = getApp()
Page({
  data: {
    flag: 0,
    avatarUrl: defaultAvatarUrl,
    name:'',
    token:'',
    id:'',
  },
  
  onLoad(options){
    if(options)
      if(options.flag==1){
        this.setData({flag:1})
      }
  },

  // 登录
  login(){
    var that = this
    wx.login({
      success (res) {
        app.globalData.code = res.code
        app.globalData.openId = res.openId
        wx.request({
          url: "http://8.130.118.211:5795/user/user/login",
          data: {
            "code": app.globalData.code,
            "name": '微信用户',
            "image": that.data.defaultAvatarUrl,
          },
          method: 'POST',
          success: (res) => {
            if(res.data.code==1){
              if(wx.getStorageSync('isLogin') == 1){
                wx.setStorageSync ('token',res.data.data.token)
                wx.setStorageSync('id',res.data.data.id)
                wx.reLaunch({
                  url: '/pages/shouye/index/index',
                })
              }else{
                that.setData({flag:1,token:res.data.data.token,id:res.data.data.id})
                // wx.setStorageSync ('token',res.data.data.token)
                // wx.setStorageSync('id',res.data.data.id)
                // wx.setStorageSync('isLogin', '1')
              }
            }
            else{
              wx.showToast({title: res.data.msg,duration:1500,icon:'none',mask:true})
            }
          },
          fail: (err) => {
            console.log(err)
            wx.showToast({title: '发生错误，请重试',duration:1500,icon:'none',mask:true})
          }
        })
      }
    })
  },
  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl:avatarUrl
    })
  },
  // 表单提交
  formSubmit(e){
    if(!e.detail.value.nickname){
      wx.showToast({title: '昵称不能为空',duration:1500,icon:'none',mask:true})
    }else if(this.data.avatarUrl==defaultAvatarUrl){
      wx.showToast({title: '头像不能为空',duration:1500,icon:'none',mask:true})
    }else{
      this.setData({name:e.detail.value.nickname})
      this.uploadImage(this.data.avatarUrl)
    }
  },
  // 上传图片到服务器
  uploadImage(url) {
    var that = this
    var token= ''
    if(wx.getStorageSync('token'))
      token = wx.getStorageSync('token')
    else
      token=this.data.token
    let _name = url.split("\/");
    let name = _name[_name.length-1];
    name = name.length > 10 ? name.substring(name.length - 9, name.length) : name;
    let formData = new FormData();
    formData.appendFile("file",url,name);
    let data = formData.getData();
    wx.showLoading({title: '上传中',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/file',
      header: {
        'content-type': data.contentType,
        'authentication': token,
      },
      data: data.buffer,
      method: 'POST',
      success: function(res){
        console.log(res)
        wx.hideLoading()
        if(!res.data.code){
          wx.showToast({title: '头像上传错误！',icon: 'error', duration:1500, mask:true})
          return
        }else{
          var imgurl = res.data.data
          that.setData({avatarUrl: imgurl})
          that.sendRequset()
        }
      },
      fail(res){
        wx.hideLoading()
        console.log(res)
        wx.showToast({title: '头像上传错误！',icon: 'error', duration:1500, mask:true})
        return 
      }
    });
  },
  // 发送请求修改头像昵称
  sendRequset:function(e) {
    var that = this
    var id=''
    var token=''
    if(wx.getStorageSync('token')){
        id = wx.getStorageSync('id')
        token = wx.getStorageSync('token')
    }else{
      id = that.data.id
      token = that.data.token
    }
    var name = this.data.name
    var avatarUrl = this.data.avatarUrl
    wx.request({
      url: "http://8.130.118.211:5795/user/user",
      data: {
        "id": id,
        "name": name,
        "image": avatarUrl,
      },
      header: {
        'authentication':token
      },
      method: 'PUT',
      success: (res) => {
        console.log(res)
        wx.hideLoading()
        wx.setStorageSync('isLogin', '1')
        if(this.data.token){
          wx.setStorageSync ('token',this.data.token)
          wx.setStorageSync('id',this.data.id)
        }
        app.openSocket()
        wx.reLaunch({url: '/pages/geren/geren',})
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
        wx.showToast({title: '发生错误，请重试',duration:1500,icon:'none',mask:true})
      }
    })
  },
})