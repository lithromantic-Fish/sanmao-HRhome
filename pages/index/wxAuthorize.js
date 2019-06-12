const app = getApp()
const login = require('../../utils/login.js')
let lesson
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    if(options.form && options.from==='lesson'){
      lesson=options.id
    }
  },
  onGotUserInfo(e) {//获取用户信息
   let  userInfo = e.detail.userInfo;
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo
    wx.redirectTo({
      url: 'index',
    })
      
  },
})