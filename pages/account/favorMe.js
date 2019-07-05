const {
  FavList
} = require('../../utils/Class')
const login = require('../../utils/login.js')
let config = require('../../config');
const util_wenda = require('../../utils/util_wenda');

const app = getApp()
const navs = ['谁收藏了我', '我收藏了谁']
let selectedTab = navs[0]

let self = {}

Page({

  data: {
    navs, //tab
    cards: [], //名片列表
    type: 1, //获取记录类型 1,谁看我 2,我看谁
    page: 1, //页码 
    loadAll: false, //
  },

  onLoad: function(options) {
    self = this

    if (options.type) {
      self.setData({
        type: options.type == 1 ? 1 : 2
      })

      if (self.data.type == 2) {
        selectedTab = navs[1]
      }
    }

    self.getCards() //获取数据
  },
  //tab
  changeStatus(e) {
    if (e.detail.tab) {
      selectedTab = navs.find(item => {
        return e.detail.tab === item
      })
      let _type = ''
      //同行
      if (self.data.navs[0] == e.detail.tab) {
        _type = 1
      } else if (self.data.navs[1] == e.detail.tab) {
        _type = 2
      }
      self.setData({
        type: _type,
        loadAll: false,
        page: 1
      })
      self.getCards()
    }
  },
  getCards() {
    let {
      type,
      page,
      loadAll
    } = self.data

    let prams = {
      type,
      page
    }

    // FavList.find(prams).then(res => {
    util_wenda.request({
      url: config.hrlooUrl + FavList,
      autoHideLoading: false,
      data: prams,
      method: "GET",
      withSessionKey: true
    }, this.getCards).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages_num
        } = res.data

        if (pages_num == 1 || pages_num == page) {
          self.setData({
            loadAll: true
          })
        }
        //第一页
        if (page == 1) {
          self.setData({
            cards: data.data
          })
        } else {
          //分页
          self.setData({
            cards: [...self.data.cards, ...data.data]
          })
        }
      }
    })
  },
  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getCards()
        })

      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    self.setData({
      page: 1,
      loadAll: false
    })
    self.getCards().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  //上拉加载更多
  onReachBottom: function() {
    let {
      page,
      loadAll
    } = self.data
    if (!loadAll) {
      self.setData({
        page: ++page
      })
      self.getCards()
    }
  }
})