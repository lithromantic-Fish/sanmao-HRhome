const app = getApp();
const {
  Detail,
  ApplyList,
  LookApply
} = require('../../utils/Class.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    currentPage: 1,
    activity_id: null

  },

  onLoad: function(options) {
    console.log("optinons", options.id)
    this.setData({
      activity_id: options.id
    })
    this.getApplyList()

    if (options.lookSign) {
      this.setData({
        lookSign: true
      })
      // LookApply
    }

    // Detail.get(options.id).then(res=>{
    //   this.setData({
    //     cards:res.list
    //   })
    // })
  },
  getApplyList() {
    const parms = {
      activity_id: this.data.activity_id,
      page: this.data.currentPage
    }
    ApplyList.create(parms).then(res => {
      if (res.result == 0) {
        this.setData({
          cards: res.data.data
        })
        console.log('tjis', this.data.card)
      }
    })
  }

})