// const constant = require('../../utils/constant.js')

const {
  MyEvent,

  Particulars,
  MyCard,
  GetIncome,
  GetExpend
} = require('../../utils/Class.js')

const app = getApp()

const Tabs = [{
    title: '全部',
    // url: Particulars,
    status: 0
  },
  {
    title: '收到的',
    // url: GetIncome,
    status: 1
  },
  {
    title: '支出的',
    // url: GetExpend,
    status: 2
  }
]
let tab = Tabs[0]
let self = {}

// function getRank(e) {
//   if (e < 50) return '小白'
//   if (e >= 50 && e < 200) return '新秀'
//   if (e >= 200 && e < 500) return '高手'
//   if (e >= 500 && e < 1000) return '大侠'
//   if (e >= 1000 && e < 5000) return '大仙'
//   else return '至尊'
// }


Page({

  data: {
    total: 0,
    popularity: [],
    type: '全部',
    status: 0,
    page: 1,
    loadAll: false
  },

  onLoad: function(options) {
    self = this
    self.getData()
  },
  //获取积分记录
  getData() {
    let {
      status,
      page,
      loadAll
    } = self.data

    let prams = {
      status: status,
      page: page
    }
    MyEvent.find(prams).then(res => {
      if (res && res.result === 0) {
        let {
          popularity,
          event,
          pages
        } = res.data
        if (pages == 1 || pages == page) {
          self.setData({
            loadAll: true
          })
        }
        //第一页
        if (page == 1) {
          self.setData({
            total: popularity,
            popularity: event.data
          })
        } else {
          //分页
          self.setData({
            popularity: [...self.data.popularity, ...event.data]
          })
        }
      }
    })

    // tab.url.get(app.globalData.openid).then(res => {
    //   debug.log('人气值明细==', res.list)
    //   this.setData({
    //     popularity: res.list
    //   })
    // })
    // to do
    // if(tab.title==='全部'){
    //   Particulars.get(app.globalData.openid).then(res => {
    //     debug.log('人气值明细==', res.list)
    //     this.setData({ popularity: res.list
    //      })
    //   })
    // }else if(tab.title==='收到的'){
    //   this.setData({
    //     popularity:data.popularityIn
    //   })
    // }
    // else if(tab.title==='支出的'){
    //   this.setData({
    //     popularity:data.popularityOut
    //   })
    // }


  },
  choose() {
    const array = ['全部', '收到的', '支出的']
    wx.showActionSheet({
      itemList: array,
      success: res => {
        if (array[res.tapIndex] !== tab) {
          tab = Tabs.find(item => {
            return item.title === array[res.tapIndex]
          })
          this.setData({
            page: 1,
            type: tab.title,
            status: tab.status
          })
          this.getData()
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    self.setData({
      page: 1,
      loadAll: false
    })
    self.getData().then(res => {
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
      self.getData()
    }
  }

})