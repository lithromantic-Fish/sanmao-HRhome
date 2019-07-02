const login = require('../../utils/login.js')
const util = require('../../utils/util_wenda');

const app = getApp()
const {
  Card,
  MyCardDetail
} = require('../../utils/Class.js')

const navs = [{
  title: '全部',
},
{
  title: '同城',
},
{
  title: '同行',
},
{
  title: '二度人脉',
}
]
let selectedTab = navs[0]

// let self = {}

let query = {
  page: 1
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nav: ['全部', '同行', '同城', '二度人脉'],
    nav: ['全部', '同行', '同城'],
    card: [], //我的名片
    cards: [], //猜你认识的人
    notify: false, //是否有未读系统消息
    userInfo: '',
    cardAllInfo: {},
    expired: false,
    isLogin:false,
    handleError:false //是否报100未登录标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // selectedTab = navs[0]
    self = this
    let userinfo = wx.getStorageSync('userInfo')
 
    if (userinfo) {
      self.setData({
        userInfo: userinfo
      })
      // self.getMoreCards() //猜你认识
      // self.getMyCardDetail() //我的名片详情
    }
    console.log("self",self.data.userInfo)

  },

  onShow() {
    let userinfo = wx.getStorageSync('userInfo')
    
    self = this
    self.getMyCardDetail() //我的名片详情
    if (!self.data.cards || self.data.cards.length==0){
      console.log("走了这")
      self.getMoreCards() //猜你认识
    }

    self.setData({
      userInfo: userinfo,
      isLogin: util._getStorageSync('isLogin') == 1 ? true : false
    })
    
  },
  getPhoneInfo(e){
    if (e.detail.isLogin){
      this.setData({
        isLogin:e.detail.isLogin
      })
    }
  },
  //获取用户信息
  getInfo(e) {
    let that = this
    //若是登录过期
    // if (this.data.expired) {
    //   console.log("e",e)
    //   wx.setStorageSync('userInfo', e)
    //   app.globalData.userInfo = e
    //   wx.login({
    //     success: res => {
    //       login.login(res.code, e).then(res => {
    //         console.log("我的登录", res)
    //         this.setData({
    //           userInfo: e,
    //         })
    //         // wx.setStorageSync('userInfo', res.data)
    //         query.page = 1
    //         that.getMyCardDetail()                    //我的名片详情
    //         that.getMoreCards()                       //猜你认识
    //       })
    //     }
    //   })
    // }else{
    //   console.log("e", e)
      wx.setStorageSync('userInfo', e.detail.userInfo)
      app.globalData.userInfo = e.detail.userInfo
      wx.login({
        success: res => {
          login.login(res.code, e.detail.userInfo).then(res => {
            console.log("我的登录",res)
            this.setData({
              userInfo: e.detail.userInfo,
            })
            // wx.setStorageSync('userInfo', res.data)
            query.page = 1
            that.getMyCardDetail()                    //我的名片详情
            that.getMoreCards()                       //猜你认识

          })
          wx.setStorageSync('userInfo', e.detail.userInfo)
          that.setData({
            isLogin: util._getStorageSync('isLogin') == 1 ? true : false
          })
        }
      })
    // }

    //  wx.setStorageSync("expired", false)

  },
  //分享
  onShareAppMessage() {
    return {
      title: '这是我的名片，请惠存',
      path: '/pages/cards/cardDetail?card_id=' + this.data.card.id
    }
  },
  //猜你认识
  getMoreCards(opts) {
    const that = this
    let prams = {
      rand: 1,
      // showLoading:true
    }
    let args = Object.assign(prams, opts)
    console.log(args)

    Card.find(args).then(res => {
      console.log("授权",res)
      if (res && res.result === 0 && res.data) {
        let {
          data
        } = res.data
        this.setData({
          cards: data.data
        })
      } else if (res.result == 999 ) {
        that.updataApi()
        // let userinfo = wx.getStorageSync('userInfo')
        // that.getInfo(userinfo)
      }else if(res.result ==100){
        that.setData({
          isLogin:false,
          handleError:true        //假如是接口报100，才调用获取手机号接口
        })
      }
    })
  },
  // 猜你认识 tab
  changeTab(e) {
    const that = this
    let {
      card
    } = that.data
    // console.info('changeTab e ', e, card)
    if (e.detail.tab !== selectedTab.title) {
      let opts = {}
      // console.info('e.detail.tab', e.detail.tab)
      // console.info('self.data.nav', self.data.nav)
      selectedTab = navs.find(item => {
        return item.title === e.detail.tab
      })
      //同行
      if (that.data.nav[1] == e.detail.tab) {
        opts = {
          industry: card.industry
        }
      }
      //同城
      else if (that.data.nav[2] == e.detail.tab) {
        opts = {
          city: card.city
        }
      }
      this.getMoreCards(opts)
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
    console.log("opts", opts)
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
      console.log("resfagewa",res)
      if (res.result == 0) {
        console.log("res.dta",res)
        util._setStorageSync('isLogin', 1)
        self.setData({
          isLogin: true,
          handleError:false
        })
        console.log("isLogin",self.data.isLogin)
        //授权后重新获取详情页数据
        self.getMyCardDetail()                    //我的名片详情
        self.getMoreCards()                       //猜你认识
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    })
  },

  //获取我的名片详情
  getMyCardDetail() {
    const that = this
    MyCardDetail.find().then(res => {
      if (res && res.result === 0 && res.data) {
        let {
          card_info,
          notify
        } = res.data
        console.info(res.data)
        that.setData({
          card: card_info,
          notify: notify,
          cardAllInfo: res.data
        })
        console.log("this.data.da", that.data)
      } else if (res.result == 88) {
        that.setData({
          card: []
        })
      } else if (res.result == 999) {
        that.updataApi()
        // wx.setStorageSync("expired", true)
        // that.setData({
        //   expired: true
        // })
        // let userinfo = wx.getStorageSync('userInfo')
        // console.log("userinfo",userinfo)
        // that.getInfo(userinfo)
      } else if (res.result == 100) {
        that.setData({
          isLogin: false,
          handleError: true        //假如是接口报100，才调用获取手机号接口

        })
      }
    })
  
  },
  //更新登录过期
  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getMyCardDetail()                    //我的名片详情
          that.getMoreCards()                       //猜你认识
        })

      }
    })
  },
  //下拉刷新页面
  onPullDownRefresh: function () {
    // this.getMyCardDetail().then(res => {
    //   wx.hideNavigationBarLoading()
    //   wx.stopPullDownRefresh()
    // })
  },
})