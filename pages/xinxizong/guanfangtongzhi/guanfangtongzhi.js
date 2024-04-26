Page({
  data: {
    page: 1,
    indextabs:[
      {
        id:0,
        value:"公告",
        isActive:true
      },
      {
        id:1,
        value:"问卷",
        isActive:false
      }
    ],
    index: 0,
    noticeList:[],
    questionnaireList:[]
  },

  onShow(){
    this.setData({
      noticeList:[],
      questionnaireList:[],
      page:1
    })
    if(this.data.index==0)
      this.getnoticeList()
    else
      this.getquestionnaireList()
  },
  
  // 更换公告/问卷
  handleTabsItemChange(e){
    this.setData({
      noticeList:[],
      questionnaireList:[]
    })
    //获取被点击事件的标题索引
    const {index}=e.detail;
    //修改数组
    let{indextabs}=this.data;
    indextabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      indextabs,
      noticeList:[],
      questionnaireList:[],
      page: 1,
      index:index
    })
    if(index==0)
      this.getnoticeList()
    else 
      this.getquestionnaireList()
  },
  // 获取公告列表
  getnoticeList(){
    wx.showLoading({title: '加载中',})
    var page = this.data.page
    wx.request({
    url:'http://8.130.118.211:5795/common/notice',
    method:'GET',
    data:{
      'page': page,
      'pageSize': 10
    },
    header: {
      authentication : wx.getStorageSync('token')
    },
    success:(res) => {
      // console.log(res)
      wx.hideLoading()
      if(res.data.data.records[0]){
        var oldList = this.data.noticeList
        var newDatas = res.data.data.records
        var newList = oldList.concat(newDatas)
        this.setData({
          noticeList:newList
        })
      }else{
        wx.showToast({title: '暂无更多数据',icon:'none',duration: 1000, mask: true,})
      }
    },
    fail:(err)=>{
      wx.hideLoading()
      console.log(err)
    }
    })
  },
  // 获取问卷列表
  getquestionnaireList(){
    wx.showLoading({title: '加载中',})
    var that = this
    var page = this.data.page
    console.log(page)
    wx.request({
    url:'http://8.130.118.211:5795/common/survey',
    method:'GET',
    data:{
      'page': page,
      'pageSize': 10
    },
    header: {
      authentication : wx.getStorageSync('token')
    },
    success:(res) => {
      wx.hideLoading()
      console.log(res)
      if(res.data.data.records[0]){
        var oldList = this.data.questionnaireList
        var newDatas = res.data.data.records
        var newList = oldList.concat(newDatas)
        that.setData({
          questionnaireList:newList
        })
      }else{
        wx.showToast({title: '暂无更多数据',icon:'none',duration: 1000, mask: true,})
      }
    },
    fail:(err)=>{
      wx.hideLoading()
      console.log(err)
    }
    })
  },
  // 触底刷新公告
  getMoreNot(){
    this.setData({page:this.data.page+1})
    this.getnoticeList()
  },
  // 触底刷新问卷
  getMoreQue(){
    this.setData({page:this.data.page+1})
    this.getquestionnaireList()
  },
  // 打开公告详细
  gotonotdetails(e){
    // console.log(e)
    const id=e.currentTarget.dataset.index;
    // console.log(id)
    wx.navigateTo({
      url: '/pages/xinxizong/gonggaoxiangxi/gonggaoxiangxi?id='+id
    });
  },
  // 打开问卷详细
  gotoquedetails(e){
    console.log(e)
    const id=e.currentTarget.dataset.index;
    console.log(id)
    wx.navigateTo({
      url: '/pages/xinxizong/wenjuanxiangxi/wenjuanxiangxi?id='+id
    });
  },
})