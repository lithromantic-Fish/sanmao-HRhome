// pages/answerQuestion/answerQuestion.js
let util = require('../../utils/util_wenda');
let config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadAll: false,//是否加载全部
    pages: null,        //分页的总数
    page: 1,
    answerList: [    //我的回答列表
    ],
    questionList:[],      //我的问题列表
    selectTab: 1   //1为答主，2为问题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.pages == 1 || this.data.pages == this.data.page) {
      this.setData({
        loadAll: true
      })
    }
    if(options.tab)
    {
      if (options.tab==2){
        this.setData({
          selectTab:2
        })
      }
    }
  },

  //更新登录过期
  // updataApi() {
  //   const that = this
  //   console.log("更新登录页")
  //   wx.login({
  //     success: res => {
  //       login.login(res.code).then(res => {
  //         that.getPageData()

  //       })

  //     }
  //   })
  // },
  //切换tab
  changeTabs(e) {
    console.log('1', e)
    let tab = e.currentTarget.dataset.tab
    if (tab == 1) {
      this.setData({
        selectTab: 1,
        loadAll: false
      })
      this.getPageData()
    } else {
      this.setData({
        selectTab: 2,
        loadAll: false
      })
      this.getPageData()
    }
  },

  //跳转问答详情页面
  toQuession(e) {
    let d = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/questionDetail/questionDetail?id=' + d.tid,
    })
  },
  //我的回答
  getPageData: util.debounce(function () {
    wx.showLoading({
      title: '加载中...',
    })
    let tab = null
    if (this.data.selectTab==1){
        tab = 4
    }else{
        tab = 2
    }
    let that = this
    util.request({
      url: config.apiUrl + '/hr/group/question/mythreads',
      method: "POST",
      withSessionKey: true,
      data: {
        tab: tab,
        page: that.data.page
      }
    }).then(res => {
      wx.hideLoading()
      let data = res.data.data
      console.log('data', data)
      if (res.result == 0) {
        if (that.data.page > 1) {
          that.setData({
            answerList: this.data.answerList.concat(data),
            pages: res.data.pages,
            loadAll:false
          })
        } else {
          that.setData({
            answerList: data,
            pages: res.data.pages,
            loadAll: true

          })
        }
      }
    })
  }, 500),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPageData()

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
    // this.setData({
    //   page: 1
    // })
    // this.getPageData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(111111111111)
    let addPage = this.data.page
    if (addPage == this.data.pages) {
    this.setData({
      loadAll: true
    })
      // wx.showToast({
      //   title: '已加载全部'
      // })
      return
    }
    else {
      ++addPage
      this.setData({
        page: addPage,
        loadAll: false
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
