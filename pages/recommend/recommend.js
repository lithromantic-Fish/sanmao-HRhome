const app = getApp()
let util = require('../../utils/util_wenda');
let config = require('../../config');

const login = require('../../utils/login.js')
let activities
let code
const notice = require('../../vendors/WxNotificationCenter')
const location = require('../../utils/getLocation')
const {
  ActivityGround,
  ActBanner,
  BannerList,
  ActivityList,
  RecommendList
} = require('../../utils/Class')

let self = {}
let myCard = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // activities:data.activities,
    activities: [],
    isLogin:false,
    page: 1,
    name: '',
    imgUrls: [],
    recommendList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
    activities = [];

    code = null

    location.getLocation(selectedCityInfo => {
      app.globalData.selectedCityInfo = selectedCityInfo
      notice.postNotificationName('Addcity', selectedCityInfo)
      // if (!app.globalData.selectedCityInfo.cityCode) {
      //   code ='110000'
      // } else {
      code = app.globalData.selectedCityInfo.cityCode
      // }
      // this.getActivities(code);
    }, () => {
      code = '110000'
    })
    let userInfo = wx.getStorageSync('userInfo')
    myCard = wx.getStorageSync('card')

    if (userInfo) {
      this.setData({
        userInfo,
      })
    }
  
  },

  //拉起手机授权
  _getPhoneNumber: function (res) {
    let data = res.detail
    if (data.encryptedData && data.iv) {
      this._confirmEvent(data)
    } else {
      util.gotoPage({
        url: '/pages/login/login'
      })
    }

  },

  /**
   * 获取手机号码回调
   */
  _confirmEvent: function (opts) {
    let self = this
    let data = {}

    if (opts.currentTarget) {
      data = arguments[0].detail.getPhoneNumberData
    } else {
      data = {
        encryptedData: opts.encryptedData,
        iv: opts.iv
      }
    }

    util.request({
      url: config.apiUrl + '/hr/special/wxapp/autoRegister',
      data: data,
      autoHideLoading: false,

      method: "POST",
      withSessionKey: true
    }).then(res => {

      if (res.result == 0) {
        util._setStorageSync('isLogin', 1)
        self.setData({
          ['isLogin']: true
        })
        //授权后重新获取详情页数据
        this.getCommentList();
        this.getIndexData();
        util.runFn(self.getInitData)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    })
  },

  
  //强力推荐

  getRecommend(){
    
    let {
      page,
    } = self.data

    const parms = {
      page,
    }
    RecommendList.create(parms).then(res => {
      if (res && res.result === 0) {
        self.setData({
          recommendList:res.data,
          loadAll:true
        })
        // //第一页
        // if (page == 1) {
        //   self.setData({
        //     recommendList: data
        //   })
        // } else {
        //   //分页
        //   self.setData({
        //     recommendList: [...self.data.recommendList, ...data]
        //   })
        // }
      }

    })
  },

//获取首页轮播
  getBanner() {
    BannerList.find().then(res => {
      this.setData({
        imgUrls: res.data
      })
    })

  },
//轮播点击
  gotoWeb(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.image.BanUrl
    })

  },
  //登录后重新获取数据
  getInfo(e) {
    let userinfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userinfo
    })
    // wx.setStorageSync('userInfo', e.detail.userInfo)
    // app.globalData.userInfo = e.detail.userInfo
    wx.login({
      success: res => {
        login.login(res.code, userinfo).then(res => {
          // debug.log(res)
          wx.setStorageSync("expired", false)
          this.getRecommend()
          this.getBanner()
        })
      }
    })
  },
//hr人脉圈，你问我答，hr活动圈跳转
  gotoPage(e) {
    const path = e.currentTarget.dataset.path
    let card = wx.getStorageSync('card')
    if (path=='cards'){
      wx.navigateTo({
        url: '/pages/cards/cards',
      })
    } else if (path =='activities'){
      wx.navigateTo({
        url: '/pages/activities/activityGround',
      })
    }else if(path=='answer'){
      wx.navigateTo({
        url: '/pages/answerQuestion/answerQuestion',
      })
    }
    // wx.navigateTo({
    //   url: path
    // })
  },

  onShow: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.getRecommend()
              this.getBanner()
            }
          })
        } else {

        }

      }      
    })
    self = this
    
    self.setData({
      isLogin: util._getStorageSync('isLogin') == 1 ? true : false
    })
    let userinfo = wx.getStorageSync('userInfo')
    if (userinfo) {
      self.setData({
        userInfo: userinfo
      })
      console.log("userinfo", userinfo)
      self.setData({
        expired: wx.getStorageSync("expired") || ''
      })
      
      if (self.data.expired) {
        const that = self
        that.getInfo(that.data.userInfo)
        // wx.showModal({
        //   title: '提示',
        //   content: '登录过期，请重新登录',
        //   showCancel: false,
        //   success(res) {
        //     if (res.confirm) {
        //       that.getInfo(that.data.userInfo)
        //     } else if (res.cancel) {
        //     }
        //   }
        // })
        // this.getInfo(this.data.userInfo)
      }
    }
 
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
  // onPullDownRefresh: function () {
  //   this.getActivities()
  //   this.getBanner()
  //   wx.hideNavigationBarLoading()
  //   wx.stopPullDownRefresh()
  // },
  // //下拉刷新
  // onPullDownRefresh: function() {
  //   self.setData({
  //     page: 1,
  //     loadAll: false
  //   })
  //   self.getCards().then(res => {
  //     wx.hideNavigationBarLoading()
  //     wx.stopPullDownRefresh()
  //   })
  // },
  // //上拉加载更多
  // onReachBottom: function() {
  //   let {
  //     page,
  //     loadAll
  //   } = self.data
  //   if (!loadAll) {
  //     self.setData({
  //       page: ++page
  //     })
  //     self.getCards()
  //   }
  // },


  //下拉刷新
  onPullDownRefresh: function () {
    // self.setData({
    //   page: 1,
    //   loadAll: false
    // })
    // self.getActiveInfo()
    // wx.hideNavigationBarLoading()
    // wx.stopPullDownRefresh()
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
      self.getRecommend()
    }
  }

  /**
   * 用户点击右上角分享
   */

})