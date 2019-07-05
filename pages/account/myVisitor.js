const {
  ViewList,
} = require('../../utils/Class')
const login = require('../../utils/login.js')
let config = require('../../config');
const util_wenda = require('../../utils/util_wenda');
// const debug = require('../../utils/debug')
const navs = ['谁看过我', '我看过谁']
const app = getApp()
let selectedTab = navs[0]

let self = this

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
    }

    self.getCards() //获取数据
  },
  //获取数据
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

    util_wenda.request({
      url: config.hrlooUrl + ViewList,
      autoHideLoading: false,
      data: prams,
      method: "GET",
      withSessionKey: true
    }, this.getCards).then(res => {
    // ViewList.find(prams).then(res=>{


      if (res && res.result === 0) {
        let {
          data,
          pages,
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
          console.info('fenye',data.data)
          self.setData({
            cards: [...self.data.cards, ...data.data]
          })
        }  
      }
    })
    // if (selectedTab === '谁看过我') {
    //   VisitMe.get(app.globalData.openid).then(res => {
    //     debug.log(res)
    //     if (res.list && res.list.length > 0) {
    //       this.setData({
    //         cards: res.list
    //       })
    //     }
    //   })
    // } else {
    //   MyVisitor.get(app.globalData.openid).then(res => {
    //     debug.log(res)
    //     if (res.list && res.list.length > 0) {
    //       this.setData({
    //         cards: res.list
    //       })
    //     }
    //   })
    // }
  },
  //更新登录过期
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
  // tab
  changeStatus(e) {
    // debug.log(e)
    if (e.detail.tab !== selectedTab) {
      selectedTab = navs.find(item => {
        return item === e.detail.tab
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
  //下拉刷新
  onPullDownRefresh: function () {
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
  onReachBottom: function () {
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