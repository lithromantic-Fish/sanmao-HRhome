const app = getApp();

const login = require('../../utils/login.js')
const {
  Card
} = require('../../utils/Class')
// const eventBus = require('../../utils/eventbus')

let query = {
  page: 1
}
let cards = [];

Page({
  data: {
    loadAll: false,
    cards: [],
    userInfo: ''
  },

  onLoad: function(options) {
    query.page = 1
    this.getCards();

    // if (app.globalData.userInfo) {
    //   userInfo = app.globalData.userInfo
    //   this.setData({
    //     userInfo
    //   })
    // }
    // eventBus.on('delete', this.refreshCards)
  },
  onShow() {
    
    let userinfo = wx.getStorageSync('userInfo')
    console.log("userInfo", userinfo)
    if (userinfo) {
      this.setData({
        userInfo: userinfo
      })
    }

    query.page = 1
    this.getCards();
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

  // refreshCards() {
  //   query.page = 1
  //   this.getCards();
  // },
  //初始化页面数据 获取名片列表
  getCards() {
    let self = this
    query.showLoading = true
    if (self.data.loadAll) return false;

    return Card.find(query).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages,
          pages_num
        } = res.data

        if (pages_num == 1 || pages_num == query.page) {
          self.setData({
            loadAll: true
          })
        }
        //第一页
        if (query.page == 1) {
          self.setData({
            cards: data.data
          })
        } else {
          //分页
          self.setData({
            cards: [...self.data.cards, ...data.data]
          })
        }  
      } else if(res.result==999){
        // 当result的值不为0，为其他情况时
        // console.log(res.msg)
        self.updataApi()
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    query.page = 1
    this.setData({
      loadAll: false
    })
    this.getCards().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  //上拉加载更多
  onReachBottom: function() {
    const {
      loadAll
    } = this.data
    if (!loadAll) {
      query.page++
      this.getCards()
    }
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
          this.getCards()
        })
      }
    })
  }
})