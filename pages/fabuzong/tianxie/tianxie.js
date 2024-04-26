const FormData = require('../../../utils/formdata.js')
const DatePickerUtil = require('../../.././utils/DatePicker') 
Page({
  data: {
    flag: 0,
    imageNums: 0,
    state: 1,
    showOverlay: false,
    indexlabels:[
      {
        id:1,
        value:"问卷",
        isChoosed:false
      },
      {
        id:2,
        value:"提问",
        isChoosed:false
      },
      {
        id:3,
        value:"投票",
        isChoosed:false
      },
      {
        id:4,
        value:"跑腿",
        isChoosed:false
      },
      {
        id:5,
        value:"失物招领",
        isChoosed:false
      },
      {
        id:6,
        value:"租借",
        isChoosed:false
      },
      {
        id:7,
        value:"出/收物",
        isChoosed:false
      },
      {
        id:8,
        value:"其它",
        isChoosed:false
      }
    ],
    fileList: [],
    imageList: [],
    title: '',
    content: '',
    phone: '',
    nums: '',
    labels: [],
    emergency: '',
    bonus: '',
    reqTime: '',
    endTime: '',
    StartTime: '',
    EndTime: '',
  	time:'选择预约时间',
    multiArray:[],//piker的item项
    multiIndex:[],//当前选择列的下标
    year:'',//选择的年
    month:'',//选择的月
    day:'',//选择的日
    hour:'',//选择的时
    minute:'',//选择的分
  },

  //获取textarea内容
  getcontent(e){
    this.setData({
      content: e.detail.value,
    })
  },

  //获取第一页中的input数据
  getdatas1(e){
    var that = this
    if(!e.detail.value.title){
      wx.showToast({title: '标题不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!that.data.content){
      wx.showToast({title: '内容不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(e.detail.value.title.length>10){
      wx.showToast({title: '标题不能多于10个字',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!e.detail.value.phone){
      wx.showToast({title: '联系方式不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(!e.detail.value.nums){
      wx.showToast({title: '帮助人数不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else if(e.detail.value.nums){
      var reqNum = e.detail.value.nums
      for(var i=0;i<reqNum.length;i++){
        if(reqNum[i]<'0' || reqNum[i]>'9'){
          wx.showToast({title: '帮助人数格式错误',icon: 'none', duration: 1500, mask: true,})
          return 
        }
      }
    }

    if(e.detail.value.title && e.detail.value.phone && e.detail.value.nums){
      this.setData({
        title: e.detail.value.title,
        phone: e.detail.value.phone,
        nums: e.detail.value.nums,
      })
    }
    if(!this.getLabel())
      return 
    var datas = this.data
    if(datas.title && datas.content && datas.phone && datas.nums && datas.labels && datas.emergency){
      this.showOverlay()
    }else{
      wx.showToast({title: '暂无数据',icon: 'none', duration: 1000, mask: true,})
    }
  },

  //获取第二页中的input数据
  getdatas2(e){
    var bonus = e.detail.value.bonus
    if(!this.data.reqTime || !this.data.endTime){
      wx.showToast({title: '时间错误！',icon: 'none', duration: 1000, mask: true,})
      return 
    }
    var that = this
    if(!bonus){
      wx.showToast({title: '报酬不能为空！',icon: 'none', duration: 1000, mask: true,})
      return 
    }else{
      for(var i=0;i<bonus.length;i++){
        if(bonus[i]<'0' || bonus[i]>'9'){
          wx.showToast({title: '格式错误',icon: 'none', duration: 1500, mask: true,})
          return 
        }
      }
    }
    if(that.data.emergency==1 && Number(bonus)<1){
      wx.showToast({title: '加急贴的报酬不能低于1!',icon: 'none', duration: 1500, mask: true,})
      return 
    }
    this.setData({
      bonus: bonus,
    })

    wx.showModal({
      title: '确认发布',
      content: '发布后将扣除您的'+Number(this.data.bonus)*Number(this.data.nums)+'益时',
      success: function (res) {
        if (res.confirm) {
          that.uploadDatas()
        }
      }
    })
  },


  //循环上传图片
  uploadDatas(){
    var that = this
    var imgList
    if(that.data.fileList.length == 0){
      imgList = []
      this.sendRequset()
    }
    else{
      imgList = that.data.fileList
      that.setData({imageNums:imgList.length})
    }
    if(imgList){
      for(let i=0;i<imgList.length;i++){
        // console.log(imgList[i])
        this.uploadImage(imgList[i])
        if(this.data.state != 1)
        {
          wx.showToast({title: '图片上传失败！',icon: 'error', duration: 1500, mask:true})
          return 
        }
      }
    }
    
  },

  //发送请求
  sendRequset(){
    var that = this
    var title = that.data.title
    var imgList
    if(that.data.imageList.length == 0){
      imgList = null
    }
    else{
      imgList = that.data.imageList
    }
    var content = that.data.content
    var phone = that.data.phone
    var nums = Number(that.data.nums)
    var labels = that.data.labels
    var emergency = Number(that.data.emergency)
    var bonus = Number(that.data.bonus)
    var reqTime = that.data.reqTime
    var endTime = that.data.endTime
    console.log(imgList,title,content,phone,nums,labels,emergency,bonus,reqTime,endTime)
    wx.request({
      url: 'http://8.130.118.211:5795/user/request',
      data:{
        'id': null,
        'userId': wx.getStorageSync('id'),
        'title': title,
        'content': content,
        'reqNum': nums,
        'helpNum': null,
        'contact': phone,
        'bonus': bonus,
        'reqTime': reqTime,
        'endTime': endTime,
        'emergency': emergency,
        'image': imgList,
        'labels': labels,
      },
      header: {
        'content-type': 'application/json',
        "authentication" : wx.getStorageSync('token')
      },
      method : 'POST',
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
          wx.showToast({
            title: '发布成功！',
            icon: 'success', 
            duration: 1500, 
            mask: true,
            success: function () {
              setTimeout(function () {
              wx.reLaunch({
              url: '/pages/xinxizong/qiuzhujilu/qiuzhujilu',
                })
              }, 1500);}
          })
        }else if(res.data.msg == "已提交，等待后台人员审核后即发布"){
            wx.showToast({
              title: res.data.msg,
              icon: 'none', 
              duration: 3000,
              mask: true,
              success: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/shouye/index/index',
                  })
                }, 3000);}
            })
          console.log(res)
        }else{
            wx.showToast({title:"发布错误，请稍后再试",duration:3000,icon: 'error', mask: true,})
            console.log(res)
        }
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },

  //获取已经选择了的标签
  getLabel(){
    var that = this
    var choosedLabels = []
    var labelList = this.data.indexlabels
    // console.log(labelList)
    for(let i=0;i<8;i++){
      if(labelList[i].isChoosed){
        choosedLabels.push(labelList[i].id)
      }
    }
    if(choosedLabels.length<1){
      wx.showToast({title: '标签不能为空！',icon: 'none', duration: 1500, mask: true,})
    }else if(choosedLabels.length>1){
      wx.showToast({title: '标签最多选一个！',icon: 'none', duration: 1500, mask: true,})
      return 0
    }else{
      var sendLabel = []
      var index = choosedLabels[0]-1
      var labelllll = that.data.indexlabels[index].value
      if(that.data.emergency == 1){
        sendLabel = [{'label':labelllll},{'label':'紧急'}]
      }else{
        sendLabel = [{'label':labelllll}]
      }
      // console.log(sendLabel)
      that.setData({
        labels: sendLabel,
      })
      // console.log(this.data.labels)
      return 1
    }
  },

  //获取是否紧急
  changeEmergency(e){
    var state = e.currentTarget.dataset.index
    this.setData({
      emergency: state,
    })
  },

  showOverlay: function () {
    this.setData({
      showOverlay: true
    });
    //获取 DatePickerUtil 工具下的方法
    var  loadPickerData=DatePickerUtil.loadPickerData()
    var  getCurrentDate=DatePickerUtil.getCurrentDate()
    var  GetMultiIndex=DatePickerUtil.GetMultiIndex()
    
    //这里写的是为了记录当前时间
    let year=parseInt(getCurrentDate.substring(0,4)); 
    let month=parseInt(getCurrentDate.substring(5,7)); 
    let day=parseInt(getCurrentDate.substring(8,10)); 
    let hour=parseInt(getCurrentDate.substring(11,13));   
    let minute=parseInt(getCurrentDate.substring(14,16)); 
    
    this.setData({  
      multiArray:loadPickerData,//picker数组赋值，格式 [years, months, days, hours, minutes]
      multiIndex:GetMultiIndex,//设置pickerIndex，[0,0,0,0,0]
      StartTime:getCurrentDate, //设置开始时间 ，currentYears+'-'+mm+'-'+dd+' '+hh+':'+min
      EndTime:getCurrentDate, //设置结束时间 ，currentYears+'-'+mm+'-'+dd+' '+hh+':'+min
      year:year,//记录选择的年
      month:month,//记录选择的月
      day:day,//记录选择的日
      hour:hour,//记录选择的时
      minute:minute,//记录选择的分 
    });   
  },

  hideOverlay: function () {
    this.setData({
      showOverlay: false
    });
  },

  // 标签改动
  changeLabel:function (e) {
    var index = e.currentTarget.dataset.index-1
    var labels = this.data.indexlabels
    labels[index].isChoosed = !labels[index].isChoosed
    this.setData({
      indexlabels: labels
    })
    // console.log(this.data.indexlabels)
  },

  //选择照片
  chooseImage:function (){
    var that = this
    var imageList = this.data.fileList
    if(imageList.length < 3){
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success:  (res)=> {
          // console.log(res)
          var size = res.tempFiles[0]['size'];
          // 图片尺寸过大则压缩图片
          wx.showLoading({title: '上传中',duration: 1000, mask: true,})
          if (size > 1048579) {
            wx.getImageInfo({
              src: res.tempFilePaths[0],
              success: function (rr) {
                var ctx = wx.createCanvasContext('attendCanvasId');
                var ratio = 1;
                var canvasWidth = rr.width
                var canvasHeight = rr.height;
  
                var quality = 0.6;
                while (canvasWidth > 3000 || canvasHeight > 3000) {
                  canvasWidth = Math.trunc(rr.width / ratio)
                  canvasHeight = Math.trunc(rr.height / ratio)
                  ratio += 0.1;
                }
                quality = (quality + (ratio / 10)).toFixed(1);
                if (quality > 1) {
                  quality = 1;
                }
                that.setData({
                  canvasWidth: canvasWidth,
                  canvasHeight: canvasHeight
                });
                ctx.drawImage(res.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
                ctx.draw();
  
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'attendCanvasId',
                    width: 0,
                    height: 0,
                    destWidth: canvasWidth,
                    destHeight: canvasHeight,
                    fileType: 'jpg',
                    quality: quality,
                    success: function success(path) {
                      imageList.push(res.tempFiles[0].path)
                      that.setData({
                        fileList: imageList
                      });
                      wx.showToast({title: '上传成功',icon: 'success',duration: 500, mask: true,})
                    },
                    fail: function fail(e) {
                      wx.hideLoading();
                      wx.showToast({title: '头像上传失败',icon: 'error',duration: 1000});
                    }
                  });
                }, 1000);
              }
            });
          } else {
            imageList.push(res.tempFiles[0].path)
            that.setData({
              fileList: imageList
            });
            wx.showToast({title: '上传成功',icon: 'success',duration: 500, mask: true,})
          }
        }
      })
    }else{
      wx.showToast({
        title: '最多只能上传三张图片！',icon: 'none',duration: 1000, mask: true,
      })
    }
  },
  // 图片预览
  preview(e){
    var index = e.currentTarget.dataset.index
    var imageList = this.data.fileList
    wx.previewImage({
      current: imageList[index], 
      urls: imageList
    })
  },
  // 删除照片
  deleteImage(e) {
    var index = e.currentTarget.dataset.index
    var imgData = this.data.fileList;
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确认删除则点击确定',
      success: function (res) {
        if (res.confirm) {
          imgData.splice(index, 1);
          that.setData({
              fileList: imgData
          })
        }
      }
    })
  },
  // 上传图片到服务器
  uploadImage(url) {
    wx.showLoading({title: '图片上传中',})
    var that = this
    let _name = url.split("\/");
    let name = _name[_name.length-1];
    name = name.length > 10 ? name.substring(name.length - 9, name.length) : name;
    let formData = new FormData();
    formData.appendFile("file",url,name);
    let data = formData.getData();
    console.log(data.buffer)
    wx.showLoading({title: '上传图片中...',})
    wx.request({
      url: 'http://8.130.118.211:5795/common/file',
      header: {
        'content-type': data.contentType,
        'authentication' : wx.getStorageSync('token')
      },
      data: data.buffer,
      method: 'POST',
      success: function(res){
        wx.hideLoading()
        var imgurl = res.data.data
        var simageList = that.data.imageList
        simageList = simageList.concat(imgurl)
        that.setData({
          imageList: simageList,
          flag:that.data.flag+1
        })
        console.log(that.data.imageList)
        if(that.data.imageNums == that.data.flag)
        {
          wx.hideLoading()
          that.sendRequset()
        }
        return 
      },
      fail(res){
        wx.hideLoading()
        console.log(res)
        wx.showToast({title: '图片上传失败！',icon: 'error', duration:1500, mask:true})
        that.setData({
          state:0
        })
        return 
      }
    });
  },



  //时间选择
  StartPickerChange: function(e) { //时间日期picker选择改变后，点击确定 
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex; // 当前选择列的下标
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day} ${hour}:${minute}`); 
    
    this.setData({
      StartTime: year+ month+ day + hour.replace('时','')+':'+minute.replace('分',''),
      EndTime: year+ month+ day + hour.replace('时','')+':'+minute.replace('分',''),
      year:year, //记录选择的年
      month:month, //记录选择的月
      day:day, //记录选择的日
      hour:hour, //记录选择的时
      minute:minute, //记录选择的分 
    })
    // console.log(this.data)
  }, 
  StartPickerColumnChange: function(e) { //监听picker的滚动事件
  
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    
    let getCurrentDate = DatePickerUtil.getCurrentDate();//获取现在时间  
    let currentYear = parseInt(getCurrentDate.substring(0,4)); 
    let currentMonth = parseInt(getCurrentDate.substring(5,7)); 
    let currentDay = parseInt(getCurrentDate.substring(8,10)); 
    let currentHour = parseInt(getCurrentDate.substring(11,13));  
    let currentMinute = parseInt(getCurrentDate.substring(14,16)); 
    
    if (e.detail.column == 0) {//修改年份列 
     
      let yearSelected = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);//当前选择的年份
 
      this.setData({ 
        multiIndex:[0,0,0,0,0] ,//设置pickerIndex
        year:yearSelected //当前选择的年份
      });
      
      if(yearSelected == currentYear){//当前选择的年份==当前年份  
        var loadPickerData=DatePickerUtil.loadPickerData();
        
        this.setData({
          multiArray:loadPickerData,//picker数组赋值
          multiIndex:[0,0,0,0,0] //设置pickerIndex
        });
        
      }else{  // 选择的年份！=当前年份 
      
        // 处理月份
        let monthArr=DatePickerUtil.loadMonths(1,12)
        // 处理日期
        let dayArr=DatePickerUtil.loadDays(currentYear,currentMonth,1) 
        // 处理hour
        let  hourArr=DatePickerUtil.loadHours(0,24); 
        // 处理minute
        let  minuteArr=DatePickerUtil.loadMinutes(0,60)
         
        // 给每列赋值回去
        this.setData({
          ['multiArray[1]']: monthArr,
          ['multiArray[2]']: dayArr,
          ['multiArray[3]']: hourArr,
          ['multiArray[4]']: minuteArr
        });
      }
    }
    if (e.detail.column == 1) {//修改月份列
      let mon = parseInt(this.data.multiArray[e.detail.column][e.detail.value]); //当前选择的月份
      this.setData({
        month:mon  // 记录当前列
      })
      
      if(mon==currentMonth){//选择的月份==当前月份 
        if(this.data.year==currentYear){  
        
          // 处理日期
          let dayArr=DatePickerUtil.loadDays(currentYear,mon,currentDay) 
          // 处理hour
          let  hourArr=DatePickerUtil.loadHours(currentHour,24); 
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(currentMinute,60)

          this.setData({ 
            ['multiArray[2]']:dayArr,
            ['multiArray[3]']: hourArr,
            ['multiArray[4]']: minuteArr
          })
        }else{ 
          // 处理日期
          let dayArr=DatePickerUtil.loadDays(currentYear,mon,1) 
          // 处理hour
          let  hourArr=DatePickerUtil.loadHours(0,24); 
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(0,60)
          
          this.setData({
            ['multiArray[2]']:dayArr,
            ['multiArray[3]']: hourArr,
            ['multiArray[4]']: minuteArr
          });
        } 
      }else{  // 选择的月份！=当前月份 
         // 处理日期
         let dayArr = DatePickerUtil.loadDays(currentYear,mon,1) // 传入当前年份，当前选择的月份去计算日
         // 处理hour
         let  hourArr = DatePickerUtil.loadHours(0,24); 
         // 处理minute
         let  minuteArr = DatePickerUtil.loadMinutes(0,60)
         
       	 this.setData({
           ['multiArray[2]']:dayArr,
           ['multiArray[3]']: hourArr,
           ['multiArray[4]']: minuteArr
         });
      } 
    } 
    if(e.detail.column == 2) {//修改日
      let dd = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);//当前选择的日
      this.setData({
        day:dd
      })
      if(dd==currentDay){//选择的日==当前日
        if(this.data.year==currentYear&&this.data.month==currentMonth){//选择的是今天 
        
         // 处理hour
         let  hourArr=DatePickerUtil.loadHours(currentHour,24); 
         // 处理minute
         let  minuteArr=DatePickerUtil.loadMinutes(currentMinute,60)
         
         this.setData({
            ['multiArray[3]']: hourArr,
            ['multiArray[4]']: minuteArr
         });
         
        }else{ //选择的不是今天 
          // 处理hour
          let  hourArr=DatePickerUtil.loadHours(0,24); 
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(0,60)
          
          this.setData({
             ['multiArray[3]']: hourArr,
             ['multiArray[4]']: minuteArr
          });
        }
      }else{  // 选择的日！=当前日 
       // 处理hour
       let  hourArr=DatePickerUtil.loadHours(0,24); 
       // 处理minute
       let  minuteArr=DatePickerUtil.loadMinutes(0,60)
       
       this.setData({
         ['multiArray[3]']: hourArr,
         ['multiArray[4]']: minuteArr
       });
      }
    } 
    if(e.detail.column == 3) {//修改时
      let hh = parseInt(this.data.multiArray[e.detail.column][e.detail.value]); //当前选择的时
      this.setData({
        hour:hh
      })
      if(hh==currentHour){//选择的时==当前时 
        if(this.data.year==currentYear&&this.data.month==currentMonth&&this.data.month==currentMonth){   // 选择的是今天
          
          // 处理minute
            let  minuteArr=DatePickerUtil.loadMinutes(currentMinute,60)
            this.setData({ 
              ['multiArray[4]']: minuteArr
            });
        }else{ // 选择的不是今天
        
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(0,60)
          this.setData({ 
            ['multiArray[4]']: minuteArr
          });
        } 
      }else{//选择的时！=当前时 
        // 处理minute
        let  minuteArr=DatePickerUtil.loadMinutes(0,60)
        this.setData({ 
          ['multiArray[4]']: minuteArr
        });
      }
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    data.multiIndex[e.detail.column] = e.detail.value; //将值赋回去
    
    this.setData(data);  //将值赋回去
  },
  EndPickerChange: function(e) { //时间日期picker选择改变后，点击确定 
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex; // 当前选择列的下标
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day} ${hour}:${minute}`); 

    this.setData({
      EndTime: year+ month+ day +  hour.replace('时','')+':'+minute.replace('分',''),
      year:year, //记录选择的年
      month:month, //记录选择的月
      day:day, //记录选择的日
      hour:hour, //记录选择的时
      minute:minute, //记录选择的分 
    })
    
    // console.log(this.data)
    this.sendDates()
    this.CheakTime()
  }, 
  EndPickerColumnChange: function(e) { //监听picker的滚动事件
  
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    
    let getCurrentDate = DatePickerUtil.getCurrentDate();//获取现在时间  
    let currentYear = parseInt(getCurrentDate.substring(0,4)); 
    let currentMonth = parseInt(getCurrentDate.substring(5,7)); 
    let currentDay = parseInt(getCurrentDate.substring(8,10)); 
    let currentHour = parseInt(getCurrentDate.substring(11,13));  
    let currentMinute = parseInt(getCurrentDate.substring(14,16)); 
    
    if (e.detail.column == 0) {//修改年份列 
     
      let yearSelected = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);//当前选择的年份
 
      this.setData({ 
        multiIndex:[0,0,0,0,0] ,//设置pickerIndex
        year:yearSelected //当前选择的年份
      });
      
      if(yearSelected == currentYear){//当前选择的年份==当前年份  
        var loadPickerData=DatePickerUtil.loadPickerData();
        
        this.setData({
          multiArray:loadPickerData,//picker数组赋值
          multiIndex:[0,0,0,0,0] //设置pickerIndex
        });
        
      }else{  // 选择的年份！=当前年份 
      
        // 处理月份
        let monthArr=DatePickerUtil.loadMonths(1,12)
        // 处理日期
        let dayArr=DatePickerUtil.loadDays(currentYear,currentMonth,1) 
        // 处理hour
        let  hourArr=DatePickerUtil.loadHours(0,24); 
        // 处理minute
        let  minuteArr=DatePickerUtil.loadMinutes(0,60)
         
        // 给每列赋值回去
        this.setData({
          ['multiArray[1]']: monthArr,
          ['multiArray[2]']: dayArr,
          ['multiArray[3]']: hourArr,
          ['multiArray[4]']: minuteArr
        });
      }
    }
    if (e.detail.column == 1) {//修改月份列
      let mon = parseInt(this.data.multiArray[e.detail.column][e.detail.value]); //当前选择的月份
      this.setData({
        month:mon  // 记录当前列
      })
      
      if(mon==currentMonth){//选择的月份==当前月份 
        if(this.data.year==currentYear){  
        
          // 处理日期
          let dayArr=DatePickerUtil.loadDays(currentYear,mon,currentDay) 
          // 处理hour
          let  hourArr=DatePickerUtil.loadHours(currentHour,24); 
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(currentMinute,60)

          this.setData({ 
            ['multiArray[2]']:dayArr,
            ['multiArray[3]']: hourArr,
            ['multiArray[4]']: minuteArr
          })
        }else{ 
          // 处理日期
          let dayArr=DatePickerUtil.loadDays(currentYear,mon,1) 
          // 处理hour
          let  hourArr=DatePickerUtil.loadHours(0,24); 
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(0,60)
          
          this.setData({
            ['multiArray[2]']:dayArr,
            ['multiArray[3]']: hourArr,
            ['multiArray[4]']: minuteArr
          });
        } 
      }else{  // 选择的月份！=当前月份 
         // 处理日期
         let dayArr = DatePickerUtil.loadDays(currentYear,mon,1) // 传入当前年份，当前选择的月份去计算日
         // 处理hour
         let  hourArr = DatePickerUtil.loadHours(0,24); 
         // 处理minute
         let  minuteArr = DatePickerUtil.loadMinutes(0,60)
         
       	 this.setData({
           ['multiArray[2]']:dayArr,
           ['multiArray[3]']: hourArr,
           ['multiArray[4]']: minuteArr
         });
      } 
    } 
    if(e.detail.column == 2) {//修改日
      let dd = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);//当前选择的日
      this.setData({
        day:dd
      })
      if(dd==currentDay){//选择的日==当前日
        if(this.data.year==currentYear&&this.data.month==currentMonth){//选择的是今天 
        
         // 处理hour
         let  hourArr=DatePickerUtil.loadHours(currentHour,24); 
         // 处理minute
         let  minuteArr=DatePickerUtil.loadMinutes(currentMinute,60)
         
         this.setData({
            ['multiArray[3]']: hourArr,
            ['multiArray[4]']: minuteArr
         });
         
        }else{ //选择的不是今天 
          // 处理hour
          let  hourArr=DatePickerUtil.loadHours(0,24); 
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(0,60)
          
          this.setData({
             ['multiArray[3]']: hourArr,
             ['multiArray[4]']: minuteArr
          });
        }
      }else{  // 选择的日！=当前日 
       // 处理hour
       let  hourArr=DatePickerUtil.loadHours(0,24); 
       // 处理minute
       let  minuteArr=DatePickerUtil.loadMinutes(0,60)
       
       this.setData({
         ['multiArray[3]']: hourArr,
         ['multiArray[4]']: minuteArr
       });
      }
    } 
    if(e.detail.column == 3) {//修改时
      let hh = parseInt(this.data.multiArray[e.detail.column][e.detail.value]); //当前选择的时
      this.setData({
        hour:hh
      })
      if(hh==currentHour){//选择的时==当前时 
        if(this.data.year==currentYear&&this.data.month==currentMonth&&this.data.month==currentMonth){   // 选择的是今天
          
          // 处理minute
            let  minuteArr=DatePickerUtil.loadMinutes(currentMinute,60)
            this.setData({ 
              ['multiArray[4]']: minuteArr
            });
        }else{ // 选择的不是今天
        
          // 处理minute
          let  minuteArr=DatePickerUtil.loadMinutes(0,60)
          this.setData({ 
            ['multiArray[4]']: minuteArr
          });
        } 
      }else{//选择的时！=当前时 
        // 处理minute
        let  minuteArr=DatePickerUtil.loadMinutes(0,60)
        this.setData({ 
          ['multiArray[4]']: minuteArr
        });
      }
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    data.multiIndex[e.detail.column] = e.detail.value; //将值赋回去
    
    this.setData(data);  //将值赋回去
  },
  CheakTime(){
    var state = 1
    var StartTime = this.data.StartTime
    var EndTime = this.data.EndTime
    // console.log(StartTime,EndTime)

    var StartYear = StartTime.slice(0,4)
    var EndYear = EndTime.slice(0,4)
    var StartMonth = StartTime.slice(5,7)
    var EndMonth = EndTime.slice(5,7)
    var StartDay = StartTime.slice(8,10)
    var EndDay = EndTime.slice(8,10)
    var StartHour = StartTime.split(':')[0]
    StartHour = StartHour.split('日')[1]
    var EndHour = EndTime.split(':')[0]
    EndHour = EndHour.split('日')[1]
    var StartMin = StartTime.split(':')[1]
    var EndMin = EndTime.split(':')[1]
    // console.log(StartYear,StartMonth,StartDay,StartHour,StartMin)
    // console.log(EndYear,EndMonth,EndDay,EndHour,EndMin)
    if(StartYear>EndYear){
      state = 0
    }else if(StartYear==EndYear && StartMonth>EndMonth){
      state = 0
    }else if(StartYear==EndYear && StartMonth==EndMonth && StartDay>EndDay){
      state = 0
    }else if(StartYear==EndYear && StartMonth==EndMonth && StartDay==EndDay && StartHour>EndHour){
      state = 0
    }else if(StartYear==EndYear && StartMonth==EndMonth && StartDay==EndDay && StartHour==EndHour && StartMin>EndMin){
      state = 0
    }
    if(state == 0){
      wx.showToast({title: '结束日期早于开始日期!',icon: 'none', duration:1500, mask: true})
      this.setData({reqTime:null,endTime:null})
    }
  },
  sendDates(){
    var StartTime = this.data.StartTime
    var EndTime = this.data.EndTime
    var StartHour = StartTime.split(':')[0]
    StartHour = StartHour.split('日')[1]
    if(StartHour.length==1)
      StartHour = '0' + StartHour
    var EndHour = EndTime.split(':')[0]
    EndHour = EndHour.split('日')[1]
    if(EndHour.length==1)
      EndHour = '0' + EndHour
    var stime,etime
    stime = StartTime.slice(0,4)+'-'+StartTime.slice(5,7)+'-'+StartTime.slice(8,10)+' '+StartHour+':'+StartTime.split(':')[1]+':00'
    etime = EndTime.slice(0,4)+'-'+EndTime.slice(5,7)+'-'+EndTime.slice(8,10)+' '+EndHour+':'+EndTime.split(':')[1]+':00'
    console.log(stime,etime)
    this.setData({
      reqTime: stime,
      endTime: etime,
    })
  }

})