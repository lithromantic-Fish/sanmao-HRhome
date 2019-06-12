const {
  MyCardRequst
} = require('../../utils/Class.js')

const app = getApp()
let self = {}

Page({

  data: {
    cards: []
  },

  onLoad: function(options) {
    self = this

    self.getNewCard()
  },
  //获取申请列表
  getNewCard() {
    MyCardRequst.find().then(res => {
      if (res && res.result === 0) {
        let {
          data
        } = res.data
        this.setData({
          cards: data
        })
      }
    })
  },
  onPullDownRefresh: function() {
    this.getNewCard().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  //执行同意操作后回调
  //删除当前列表中的同意过的数据
  aggress(e) {
    let {
      id
    } = e.detail
    if (!id) return
    let {
      cards
    } = self.data
    let index = cards.findIndex(item => {
      return id === item.id
    })
    cards.splice(index, 1)
    this.setData({
      cards: cards
    })
  },
})