const jsonUtils = require('/JsonUtils.js');

module.exports = {
    request: request,
    uploadFile: uploadFile,
}

/**
    * 封装wx.request,在要使用wx.request的地方请使用这个
    * 示例：
    * app.request({
    url: '/user/update_information.do',
    method: "POST",
    data: {
    fullName: e.detail.value.fullName,
    }
    }).then(respond=>{
    console.log(respond)
    })
    */
function request(rquestParams) {
    let app = getApp();
    if (!rquestParams.url) return;
    let header = rquestParams.header ? rquestParams.header : {}
    let method = rquestParams.method || "GET";
    let data = rquestParams.data
    let url = app.globalData.api + rquestParams.url;
    if (method.toUpperCase() == "PUT") {
        let other = jsonUtils.connect_data(data);
        url += other;
    }
    wx.showLoading({
        title: "加载中",
        mask: true
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            method: method,
            data: data,
            header: header,
            success: (res) => {
                wx.hideLoading();
                resolve(res);
            },
            fail: (err) => {
                wx.hideLoading();
                reject(err);
            }
        })
    })
}

