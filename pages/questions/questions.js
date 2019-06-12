const data = require('../../mock/index.js')
const app = getApp()
const login = require('../../utils/login.js')
const debug = require('../../utils/debug.js')
const {Banner,Index} = require('../../utils/Class')

Page({

  data: {

    lessons:[],
    imgUrls:['https://static.hrloo.com/hrloo56/hrhomeminiapp/img/hrHome.png','https://static.hrloo.com/hrloo56/hrhomeminiapp/img/hrHome.png','https://static.hrloo.com/hrloo56/hrhomeminiapp/img/hrHome.png']
  },
  onLoad: function (options) {

    this.setData({ userInfo: app.globalData.userInfo, })

  },
  onShow(){
 this.getData()
  },
  gotoWeb(e){
    const {image} = e.currentTarget.dataset
    debug.log(e.currentTarget.dataset.image)
    if(image.BanUrl){
      wx.navigateTo({
        url: image.BanUrl
      })
    }
  },
  getData(){
  return  Banner.find().then(res => {
      if (res.list && res.list.length > 0) {
        this.setData({
          imgUrls: res.list
        })
      } else {
        this.setData({
          imgUrls: ['https://static.hrloo.com/hrloo56/hrhomeminiapp/img/default_Image.png']
        })
      }
      Index.get(app.globalData.openid).then(res => {
        debug.log(res)
        if (res.list && res.list.length > 0) {
          this.setData({
            lessons: res.list
          })
        } else {
          this.setData({
            lessons: []
          })
        }
      })
    })

  },

  getInfo(e) {
    console.log(e)
    this.setData({ userInfo: e.detail.userInfo })
    wx.setStorageSync('userInfo', e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    wx.login({
      success: res => {
        login.login(res.code, app.globalData.userInfo).then(() => {
        })
      }
    })
  },


  onPullDownRefresh: function () {

    this.getData().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },

})