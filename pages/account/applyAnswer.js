// pages/account/applyAnswer.js

const {
  ApplyInfo,
  Give_up_apply
} = require('../../utils/Class.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      answerInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAnswerInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //申请答主信息
  getAnswerInfo(){
    ApplyInfo.create().then(res=>{
      if(res.result==0){
        console.log('res',res)
        this.setData({
          answerInfo:res.data
        })
      }
    })
  },

  //重新申请
  toApply(){
    wx.navigateTo({
      url: '/pages/applyAnswer/applyAnswer',
    })
  },
  giveUp(){
    Give_up_apply.create().then(res=>{
      if (res.result == 0) {
        wx.showToast({
          title: '放弃成功',
        })
        this.getAnswerInfo()
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none"
        })
      }
      
    })
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