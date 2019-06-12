// const data = require('../../mock/index')
const debug = require('../../utils/debug')
const { ApplyDetail,LookApply,Applyfind } =require('../../utils/Class.js')
let ApplyId, ActivityId, Openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // card:data.groupDetail[0]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Openid = options.Openid
    ApplyId = options.ApplyId
    ActivityId = options.ActivityId
    this.getData()
  },

  getData(){

    const parms = {
      apply_id: ApplyId

    }
    ApplyDetail.create(parms).then(res=>{
      this.setData({
        card:res.data
      })
    })


    // Applyfind.get(ApplyId).then(res=>{
    //   debug.log(res)
    //   this.setData({
    //     card:res.list
    //   })
    // })
    // const data = {
    //   OpenId: Openid, ApplyId, ActivityId
    // }
    // LookApply.create(data).then(res=>{
    //   debug.log(res)
    // })
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