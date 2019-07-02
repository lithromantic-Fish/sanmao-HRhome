//登陆封装
let util = require('/util_wenda');
let config = require('../config');
const {
  Login,
  MyCardDetail
} = require('Class.js')
const app = getApp()
// const debug = require('debug.js')
let hrhome_token = null

function login(code, userinfo) {
  // const data = {
  //   code, userinfo
  // }
  const data = Object.assign({
    showLoading:true,
    code: code
  }, userinfo)

  return Login.create(data).then(res => {
    // debug.log('openid====', res)
    // console.log('=22222')
    // console.log('11111',res)
    // openid = res.result.openid
    // console.log("用户登录状态 0 未登录，1 已登录======",res.data.isLogin)
    
    //将返回的登录状态存入缓存
    util._setStorageSync('isLogin', res.data.isLogin)
  
    hrhome_token = res.data.hrhome_token
    app.globalData.hrhome_token = res.data.hrhome_token
    // console.log(app.globalData.hrhome_toekn)
    wx.setStorageSync('hrhome_token', res.data.hrhome_token)
    // app.globalData.sessionKey = res.result.session_key
    // wx.setStorageSync('sessionKey', res.result.session_key)
    // app.globalData.user = res.list[0]
    // wx.setStorageSync('user', res.list[0])
    app.globalData.userInfo = res.data.userinfo
    // wx.setStorageSync('userInfo', res.data.userinfo)
    // app.globalData.AskPrice = res.AskPrice
    // wx.setStorageSync('AskPrice', res.AskPrice)
    // app.globalData.APriceDivide = res.APriceDivide
    // wx.setStorageSync('APriceDivide', res.APriceDivide)
    return MyCardDetail.find({
      'hrhome_token': hrhome_token
    }).then(r => {
      if (r && r.result === 0 && r.data) {
        let {
          card_info
        } = r.data
        // console.info('r.data', r.data)
        app.globalData.card = card_info
        wx.setStorageSync('card', card_info)
      }

    })
  })
}
module.exports = {
  login,
}