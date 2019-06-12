const { ToBeAnswer,Openid,MyCard } =require('../../utils/Class.js')
const debug = require('../../utils/debug.js')
const app = getApp()
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
const that =this
    wx.login({
      success:res=>{
        debug.log(res.code)
        const data = {
          code:res.code,
          userinfo:app.globalData.userInfo
        }
        Openid.create(data).then(res => {
          app.globalData.user = res.list[0],
            wx.setStorageSync('user', res.list[0])
            this.setData({
              user: res.list[0]
            })
        }).then(()=>{MyCard.get(app.globalData.openid).then(_res => {
          if(_res.list.BusId){
            app.globalData.card = _res.list
            wx.setStorageSync('card', _res.list)
            debug.log(_res.list)
            that.setData({
              card: _res.list
            })
          }
          debug.log(_res)

        })})
      }
    })
  },

  gotoJiaV(){
    wx.navigateTo({
      url:'vip'
    })
  },
  tobeAns(){
    ToBeAnswer.get(app.globalData.openid).then(res=>{
      debug.log(res)
      wx.showToast({
        title: '申请成功，请等待审核结果',
        icon: 'none',
        duration: 2000
      })
    })
  }
})