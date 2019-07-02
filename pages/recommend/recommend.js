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
    recommendList:[],
    handleError: false //是否报100未登录标识

    // hasClick:false
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
    myCard = wx.getStorageSync('card')
    console.log("myCard",myCard)

    // let userInfo = wx.getStorageSync('userInfo')

    // if (userInfo) {
    //     this.getRecommend()
    //     this.getBanner()
    // }
  },

  onShow: function () {
 
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: res => {
    //           this.getRecommend()
    //           this.getBanner()
    //         }
    //       })
    //     }
    //   }
    // })
    let that = this
    let userInfo = wx.getStorageSync('userInfo')      //为了去掉蒙层
    that.setData({
      userInfo,
      isLogin: util._getStorageSync('isLogin') == 1 ? true : false
    })
    if (userInfo){
      this.getRecommend()
      this.getBanner()

    }
  },

  getPhoneInfo(e) {
    console.log('e', e.detail.isLogin)
    if (e.detail.isLogin) {
      this.setData({
        isLogin: e.detail.isLogin
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
          isLogin: true,
          handleError: false

        })
        //授权后重新获取详情页数据
        self.getRecommend()
        self.getBanner()
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
      // page,
    
    }
    RecommendList.create(parms).then(res => {
      console.log("parms", parms)
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
      }else if(res.result==999){
        
        let userinfo = wx.getStorageSync('userInfo')
        self.getInfo(userinfo)
        // this.setData({
        //   noUserInfo: true
        // })
      } else if (res.result == 100) {
        self.setData({
          isLogin: false,
          handleError:true
        })
      }

    })
  },

//获取首页轮播
  getBanner() {
    BannerList.create().then(res => {
      console.log("轮播res", res)
      if(res&&res.result==0){
      this.setData({
        imgUrls: res.data
      })
      } 
      else if (res.result == 999 ) {
        let userinfo = wx.getStorageSync('userInfo')
        self.getInfo(userinfo)
      }else if(res.result==100){
        self.setData({
          isLogin:false,
          handleError: true
        })
      }

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
          // this.setData({
          //   hasClick:true
          // })
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