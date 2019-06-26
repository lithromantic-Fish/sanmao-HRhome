// const account = require('../../mock/index')
// const debug = require('../../utils/debug.js')
let util = require('../../utils/util_wenda');
let config = require('../../config');
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
    isVip:true,
    red_point:'',
    isLogin: false,
    allData:{},
    master_status:null

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
        userInfo: userinfo,
        isLogin: util._getStorageSync('isLogin') == 1 ? true : false

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
        console.log('我的名片信息',res)
        self.setData({
          master_status: res.data.master_status,
          allData:res.data
        })

        let {
          data
        } = res.data
        console.log("data.red_point", data)
        self.setData({
          card: data,
          red_point: res.data.red_point,
        })
      }
    })

  },
  tocard(){
    wx.navigateTo({
      url: '/pages/account/myCardDetail',
    })
  },
  toactive(){
    wx.navigateTo({
      url: '/pages/account/myActivities',
    })
  },
  toanswer(){
    wx.navigateTo({
      url: '/pages/account/questions',
    })
  },
  //申请加v
  getVip(){
    wx.navigateTo({
      url: '/pages/account/vip',
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
  },  
    //拉起手机授权
_getPhoneNumber: function (res) {
    console.log(res.detail.encryptedData)
    console.log(res.detail.iv)
    let data = res.detail
    if (data.encryptedData && data.iv) {
      this._confirmEvent(data)


    } else {
      util.gotoPage({
        url: '/pages/login/login'
      })
    }
    },
  /**
* 获取手机号码回调
*/
  _confirmEvent: function (opts) {
    console.log(opts)
    let self = this
    let data = {}

    if (opts.currentTarget) {
      data = arguments[0].detail.getPhoneNumberData
    } else {
      data = opts
    }
    // console.info('opts', opts)

    util.request({
      url: config.apiUrl + '/hr/special/wxapp/autoRegister',
      data: data,
      method: "POST",
      withSessionKey: true
    }).then(res => {

      if (res.result == 0) {
        console.log("res",res)
        util._setStorageSync('isLogin', 1)
        self.setData({
          ['isLogin']: true
        })

        // util.runFn(self.getInitData)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    })
  },

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