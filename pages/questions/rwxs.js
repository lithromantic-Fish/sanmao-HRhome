const data = require('../../mock/index.js')
const app = getApp()
const{Figure} = require('../../utils/Class')
const debug = require('../../utils/debug.js')
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
    // this.setData({ userInfo: app.globalData.userInfo, })
    this.getData()
  },
  getData(){
    Figure.get(app.globalData.openid).then(res=>{
      debug.log(res)
      this.setData({
        lessons:res.list
      })
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

  onPullDownRefresh: function () {
    // if(selectedTab.title==='答主'){
    //   users=[]
    // }else{
    //   answers=[]
    // }
    // selectedTab.loadAll=false
    // page=1
    this.getData()
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