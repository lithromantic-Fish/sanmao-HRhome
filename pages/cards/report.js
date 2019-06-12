let name
let card_id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasons: ['欺诈', '骚扰', '色情', '不实信息', '其他']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    name = options.name
    card_id = options.card_id

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  gotoReportDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: 'reportDetail?reason=' + e.currentTarget.dataset.reason + '&name=' + name + '&card_id=' + card_id,
    })
  }
})