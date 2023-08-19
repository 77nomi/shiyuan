module.exports = {
    showModal: showModal,
    showToast: showToast,
    showToastE: showToastE,
}

/**
 * 一些提示的组件
 */
function showModal(content) {
    wx.showModal({
        showCancel: false,
        content: content
    })
}

function showToast(title) {
    wx.showToast({
        title: title,
        duration: 1500,
        mask: true,
    });
}

function showToastE(title) {
    wx.showToast({
        title: title,
        icon: 'none',
        duration: 1500,
        mask: true,
    });

}