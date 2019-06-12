const data = require('../../mock/index.js')
const app = getApp()
const debug = require('../../utils/debug.js')
const {Original}= require('../../utils/Class')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // lessons:data.lesson,
    // imgUrls:['https://static.hrloo.com/hrloo56/hrhomeminiapp/img/hrHome.png','https://static.hrloo.com/hrloo56/hrhomeminiapp/img/hrHome.png','https://static.hrloo.com/hrloo56/hrhomeminiapp/img/hrHome.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlessons()

  },

  getlessons(){
    Original.get(app.globalData.openid).then(res=>{
      debug.log(res)
      if(res.list && res.list.length>0){
        this.setData({
          lessons:res.list
        })
      }
    })

  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getlessons()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})