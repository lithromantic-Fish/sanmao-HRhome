// pages/myFollowQuestion/myFollowQuestion.js


let myCard = ''
const app = getApp()

Component({
  properties: {
    answerList: {
      type: Array,
      value: []
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    isLoadAll: false,//是否加载全部
    pages: null,        //分页的总数
    page: 1,
    msgid: null,
    answerList: [    //关注的问题列表

    ],
  },

  methods:{
    toPublish(e) {
      console.log('e', e)
      myCard = wx.getStorageSync('card') || app.globalData.card
      console.log("mycard",myCard)
      if (!myCard) {
        wx.showModal({
          title: '提示',
          content: '您还没有名片，是否立即前往',  //已埋登录
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/cards/makeCard',
              })
            }
          }
        })
        return
      }
      let d = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/pages/answerPage/answerPage?openid=' + d.openid,
      })
      
    }
  },
 
  //跳转问答详情页面
  toMsgPage(e) {
    let d = e.currentTarget.dataset.item
    this.setData({
      msgid: d.id
    })
    console.log('d', d)
    this.hasRead(this.data.msgid)
    wx.navigateTo({
      url: '/pages/questionDetail/questionDetail?id=' + d.tid,
    })
  },

  //已读
  hasRead(msgid) {
    util.request({
      url: config.apiUrl + '/hr/group/question/read_message',
      method: "POST",
      withSessionKey: true,
      data: {
        msgid: msgid,
        voice_id: 0,
        modifyid: 0
      }
    }).then(res => {
      if (res.result == 0) {
        this.getPageData()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    })
  },


  //发布问题

  // //我的关注
  // getPageData: util.debounce(function () {
  //   wx.showLoading({
  //     title: '加载中...',
  //   })
  //   let that = this
  //   util.request({
  //     url: config.apiUrl + '/hr/group/question/mythreads',
  //     method: "POST",
  //     withSessionKey: true,
  //     data: {
  //       tab: 3,
  //       page: that.data.page,

  //     }
  //   }).then(res => {
  //     wx.hideLoading()
  //     let data = res.data.data
  //     console.log('data', data)
  //     if (res.result == 0) {
  //       if (that.data.page > 1) {
  //         that.setData({
  //           followList: this.data.followList.concat(data),
  //           pages: res.data.pages,
  //         })
  //       } else {
  //         that.setData({
  //           followList: data,
  //           pages: res.data.pages,
  //         })
  //       }
  //     }
  //   })
  // }, 500),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新，回到第一页
    this.setData({
      page: 1
    })
    this.getPageData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let addPage = this.data.page
    if (addPage == this.data.pages) {
      wx.showToast({
        title: '已加载全部'
      })
      return
    }
    else {
      ++addPage
      this.setData({
        page: addPage
      })
    }
    this.getPageData();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})