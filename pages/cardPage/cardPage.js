const login = require('../../utils/login.js')

const app = getApp()
const {
  Card,
  MyCardDetail
} = require('../../utils/Class.js')

const navs = [{
  title: '全部',
},
{
  title: '同城',
},
{
  title: '同行',
},
{
  title: '二度人脉',
}
]
let selectedTab = navs[0]

let self = {}

let query = {
  page: 1
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nav: ['全部', '同行', '同城', '二度人脉'],
    nav: ['全部', '同行', '同城'],
    card: [], //我的名片
    cards: [], //猜你认识的人
    notify: false, //是否有未读系统消息
    userInfo: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // selectedTab = navs[0]
    self = this
    // self.getMyCardDetail() //我的名片详情
    // this.getMoreCards() //猜你认识
  },

  onShow() {

    let userinfo = wx.getStorageSync('userInfo')
    console.log("userInfo", userinfo)
    if (userinfo) {
      this.setData({
        userInfo: userinfo
      })
    }
    self = this
    self.getMyCardDetail() //我的名片详情
    self.getMoreCards() //我的名片详情


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
          query.page = 1
          self.getMoreCards()
          self.getMyCardDetail() //我的名片详情
          self.getMoreCards() //我的名片详情

        })
      }
    })
  },
  //分享
  onShareAppMessage() {
    return {
      title: '这是我的名片，请惠存',
      path: '/pages/cards/cardDetail?card_id=' + this.data.card.id
    }
  },
  //猜你认识
  getMoreCards(opts) {

    let prams = {
      rand: 1
    }
    let args = Object.assign(prams, opts)
    console.log(args)

    Card.find(args).then(res => {
      if (res && res.result === 0 && res.data) {
        let {
          data
        } = res.data
        this.setData({
          cards: data.data
        })
      }
    })
  },
  // 猜你认识 tab
  changeTab(e) {
    let {
      card
    } = self.data
    // console.info('changeTab e ', e, card)
    if (e.detail.tab !== selectedTab.title) {
      let opts = {}
      // console.info('e.detail.tab', e.detail.tab)
      // console.info('self.data.nav', self.data.nav)
      selectedTab = navs.find(item => {
        return item.title === e.detail.tab
      })
      //同行
      if (self.data.nav[1] == e.detail.tab) {
        opts = {
          industry: card.industry
        }
      }
      //同城
      else if (self.data.nav[2] == e.detail.tab) {
        opts = {
          city: card.city
        }
      }
      this.getMoreCards(opts)
    }
  },

  //获取我的名片详情
  getMyCardDetail() {
    MyCardDetail.find().then(res => {
      if (res && res.result === 0 && res.data) {
        let {
          card_info,
          notify
        } = res.data
        console.info(res.data)
        self.setData({
          card: card_info,
          notify: notify
        })
      }
    })
  },
  //下拉刷新页面
  onPullDownRefresh: function () {
    this.getMyCardDetail().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
})