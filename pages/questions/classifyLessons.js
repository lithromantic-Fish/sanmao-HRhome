
const app = getApp()
const debug = require('../../utils/debug')
const data = require('../../mock/index')
const {ClassifyLesson} = require('../../utils/Class')
let id
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   id =  options.id 
   this.getLessons()
  },
  getLessons(){
    ClassifyLesson.get(`${app.globalData.openid}/${id}`).then(res=>{
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