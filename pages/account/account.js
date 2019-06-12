// const account = require('../../mock/index')
// const debug = require('../../utils/debug.js')

const login = require('../../utils/login.js')
const app = getApp()
const {
  QrCode,
  MyCardDetail,
  MyCard
} = require('../../utils/Class.js')
// const WxNotice = require('../../vendors/WxNotificationCenter.js')

let userInfo = ''
let self = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: userInfo,
    card: [],
    isVip:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  onShow() {

    self = this
    // console.info('options',options)  
    self.getMyCardInfo()  

    let userinfo = wx.getStorageSync('userInfo')
    if (userinfo) {
      this.setData({
        userInfo: userinfo
      })
    }
  },
  onShareAppMessage() {
    let {
      card
    } = self.data
    return {
      title: '这是我的名片，请惠存',
      path: '/pages/cards/cardDetail?&card_id=' + card.id
    }
  },
  //获取我的名片信息
  getMyCardInfo(){
    MyCard.find().then(res => {
      if (res && res.result === 0) {
        let {
          data
        } = res.data
        self.setData({
          card: data
        })
      }
    })

  },
  //获取用户信息
  getInfo(e) {
    // console.log(e)
    // this.setData({
    //   userInfo: e.detail.userInfo
    // })
    // wx.setStorageSync('userInfo', e.detail.userInfo)
    // app.globalData.userInfo = e.detail.userInfo
    wx.login({
      success: res => {
        login.login(res.code, e.detail.userInfo).then(res => {
          this.setData({
            userInfo: wx.getStorageSync('userInfo')
          })
          // wx.setStorageSync('userInfo', res.data)
          this.getMyCardInfo()
        })
      }
    })
  }
  // // 编辑资料
  // gotoEditor() {
  //   wx.navigateTo({
  //     url: '../cards/makeCard?type=put',
  //   })
  // },
  // getInfo(e) {
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo
  //   })
  //   wx.setStorageSync('userInfo', e.detail.userInfo)
  //   app.globalData.userInfo = e.detail.userInfo
  //   wx.login({
  //     success: res => {
  //       console.log(res)
  //       login.login(res.code, app.globalData.userInfo).then(res => {
  //         this.getMyCard()
  //       })
  //     }
  //   })
  // },
  // cardCode() {
  //   wx.navigateTo({
  //     url: 'cardCode',
  //   })
  // },
  // changeCard(card) {
  //   debug.log('从别的地方改变本页面的card', card)
  //   this.setData({
  //     card: card
  //   })
  // },
  // // getMyCard() {
  //   return MyCard.get().then(res => {
  //     console.log(res)
  //     debug.log(res.data)
  //     let data = res.data
  //     if (res.data) {
  //       this.setData({
  //         card: res.list
  //       })
  //     }
  //   })
  // },
  // onPullDownRefresh: function() {
  //   this.getMyCard().then(res => {
  //     wx.hideNavigationBarLoading()
  //     wx.stopPullDownRefresh()
  //   })
  // },
  // gotoMyQuiz() {
  //   wx.navigateTo({
  //     url: 'myQuizs'
  //   })
  // },
  // gotoMyAnswer() {
  //   wx.navigateTo({
  //     url: 'myAnswers'
  //   })
  // },
  // gotoMyActivity() {
  //   wx.navigateTo({
  //     url: 'myActivities'
  //   })
  // }
})