// const debug = require('utils/debug.js')
const {
  Openid
} = require('utils/Class.js')
global.regeneratorRuntime = require('./vendors/regenerator/runtime-module')
const {
  regeneratorRuntime
} = global


const url = "https://www.hrloo.com"
const uploadUrl = "https://www.hrloo.com"
const wssUrl = "wss://www.hrloo.com"
// const wssUrl = "wss://wxapptest.kitego.cn"

// const url = "http://www.chengp.top"
// const uploadUrl = "http://www.chengp.top"
// const wssUrl = "wss://www.chengp.top"



App({
  onLaunch: function(options) {
    const that = this;
    wx.getSystemInfo({
      success: res => {
        this.globalData.windowHeight = res.windowHeight
      },
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // debug.log('app===', this.globalData.userInfo)
              wx.setStorageSync('userInfo', res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // wx.redirectTo({
          //   url: '/pages/index/wxAuthorize',
          // })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/cardPage/cardPage',
            })
          },3000)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    card: null,
    fromLesson: null,
    url: url,
    uploadUrl: uploadUrl,
    wssUrl: wssUrl,
    loading: false,
  }
})