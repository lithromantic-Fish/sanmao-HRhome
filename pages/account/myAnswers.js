const app = getApp()
const debug = require('../../utils/debug')
const {MyAnswer} = require('../../utils/Class')
const eventBus = require('../../utils/eventbus')
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
    this.getMyAnswers()
    eventBus.on('deleteAnswer',this.deleteAnswer)
  },

  getMyAnswers(){
    MyAnswer.get(app.globalData.openid).then(res=>{
      debug.log(res)
      if(res.list &&res.list.length>0){
        let array = res.list
        array.map(item=>{
          return Object.assign(item,res.res)
        })
        this.setData({
          answers:array,
          card:res.res
        })
      }else{
        this.setData({
          answers:[],
          card: null
        })
      }
    })
  },
  deleteAnswer(){
    this.getMyAnswers()
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