// pages/answerQuestion/answerQuestion.js
const {
  Master_list,
  Quest_list
} = require('../../utils/Class')
const login = require('../../utils/login.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectTab:2,   //1为答主，2为问题
    page:1,
    loadAll:false,
    answerList:[],
    questList:[],
    master:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // myCard = wx.getStorageSync('card') || app.globalData.card
  },

//   else if(res.result== 88){

// }
  //切换tab
  changeTabs(e){
    console.log('1',e)
    let tab = e.currentTarget.dataset.tab
    if(tab==1){
      this.setData({
        selectTab :1,
        page:1,
        loadAll: false
      })
      this.getAnswerList()
    }else{
      this.setData({
        selectTab: 2,
        page: 1,
        loadAll: false
      })
      this.getQuestionList()
    }
  },
  //答主列表
  getAnswerList(){
    const self = this
    const page = this.data.page
    const parms = {
      showLoading:true,
      page:page
    }
    Master_list.create(parms).then(res => {
      // console.log("res", res.data.data)
      // this.answerList = res.data.data

      if (res && res.result === 0) {
        this.setData({
          master:res.data.master
        })
        console.log("this.data.master", this.data.master)
        console.log('resddddd',res.data)
        let {
          data,
          count,
          pages
        } = res.data.list
        res.data.list.data
      console.log('data',data)
        if (pages == 1 || pages == page) {
          self.setData({
            loadAll: true
          })
        }

        //第一页
        if (page == 1) {
          self.setData({
            answerList: data
          })
        } else {
          //分页
          self.setData({
            answerList: [...self.data.answerList, ...data]
          })
        }
      } else if (res.result == 999) {
        self.updataApi()
      }

    })
  },

  //问题列表
   getQuestionList(){
     const self = this
     const page = this.data.page
     const parms = {
       page: page
     }
     Quest_list.create(parms).then(res => {
       // console.log("res", res.data.data)
       // this.answerList = res.data.data

       if (res && res.result === 0) {
         let {
           data,
           count,
           pages
         } = res.data
          console.log("pages",pages)
          console.log("page",page)
         if (pages == 1 || pages == page) {
           self.setData({
             loadAll: true
           })
         }

         //第一页
         if (page == 1) {
           self.setData({
             questList: data
           })
         } else {
           //分页
           self.setData({
             questList: [...self.data.questList, ...data]
           })
         }
       }else if(res.result==999){
         self.updataApi()
       }

     })
   },
  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getQuestionList()
          that.getAnswerList()

        })

      }
    })
  },
  //申请答主
  applyAnswer(){
    wx.navigateTo({
      url: '/pages/applyAnswer/applyAnswer',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getAnswerList()
    this.getQuestionList()

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const self = this
    let {
      page,
      loadAll,
      selectTab
    } = self.data
    console.log('selectTab', selectTab)
    console.log('loadAll', loadAll)

    if (!loadAll) {
      self.setData({
        page: ++page
      })
      if (selectTab==1){
          this.getAnswerList()
    }else{
          this.getQuestionList()
    }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})