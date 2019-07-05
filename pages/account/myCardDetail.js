const login = require('../../utils/login.js')
const util = require('../../utils/util_wenda');
let config = require('../../config');

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
    cardAllInfo:{},
     view_point:"",
          fav_point:"",
          zan_point:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // selectedTab = navs[0]
    self = this
    // self.getMyCardDetail() //我的名片详情
    this.getMoreCards() //猜你认识
  },

  onShow() {

    self = this
    self.getMyCardDetail() //我的名片详情
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

    util.request({
      url: config.hrlooUrl + Card,
      autoHideLoading: false,
      data: args,
      method: "GET",
      withSessionKey: true
    }, self.getMoreCards).then(res => {

      if (res.result == 0) {
        console.log("res.data.data", res.data.data.data)
        this.setData({
          cards: res.data.data.data
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

    const that = this

    util.request({
      url: config.apiUrl + MyCardDetail,
      // data: data,
      autoHideLoading: false,
      method: "GET",
      withSessionKey: true
    }, that.getMyCardDetail).then(res => {

      // MyCardDetail.find().then(res => {


      if (res && res.result === 0 && res.data) {
        let {
          card_info,
          notify
        } = res.data
        that.setData({
          card: card_info,
          notify: notify,
          cardAllInfo: res.data
        })
      } else if (res.result == 88) {
        that.setData({
          card: []
        })
      } else if (res.result == 999) {
        that.updataApi()
      } else if (res.result == 100) {
        that.setData({
          isLogin: false,
          handleError: true        //假如是接口报100，才调用获取手机号接口
        })
      }
    })


  },

  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getMyCardDetail()
          that.getMoreCards()

        })

      }
    })
  },
  //下拉刷新页面
  onPullDownRefresh: function() {
    // this.getMyCardDetail().then(res => {
    //   wx.hideNavigationBarLoading()
    //   wx.stopPullDownRefresh()
    // })
  },
})