const login = require('../../utils/login.js')
const app = getApp()
// const debug = require('../../utils/debug.js')

const { GetPageUrl } = require('../../utils/Class.js')

const { regeneratorRuntime } = global
Page({
  data: {
    hasScene: false,
    redirUrl: "",
    sceneValue: ''
  },
  onLoad: function (options) {

    console.log('index-----------场景值', options)
    if (options.scene) {
      this.setData({
        sceneValue: options.scene,
        hasScene: true
      })
      console.log("sceneValue", this.data.sceneValue)
    }

    const that = this
    // let card = wx.getStorageSync('card')
    // card?app.globalData.card=card:''
      that.login()
  },
  getUrl() {
    const parms = {
      scene: this.data.sceneValue
    }
    GetPageUrl.find(parms).then(res => {
      console.log('res', res)
      wx.redirectTo({
        url: '/' + res.data.path
      })
    })
  },
  login() {
    if (app.globalData.userInfo) {
      console.log("有登录信息")

      wx.login({
        success: res => {
          // debug.log('code==',res.code)
          login.login(res.code, app.globalData.userInfo).then(res => {
            // debug.log(res)
            // if(app.globalData.fromLesson){
            //   wx.redirectTo({
            //     url:'../questions/lessonDetail?id='+app.globalData.fromLesson
            //   })

            // }else{
            //   wx.switchTab({
            //     url: '/pages/cards/cards',
            //   })
            // }
            if (this.data.hasScene) {

              this.getUrl()

            } else {
              setTimeout(() => {
                wx.switchTab({
                  url: '../cardPage/cardPage'
                })
              }, 3000)
            }
          })
        }
      })
    }
    else {
      console.log("无登录信息")
      setTimeout(()=>{
        wx.switchTab({
          url: '../cardPage/cardPage'
        })
      },3000)
    
    }
  }
})
