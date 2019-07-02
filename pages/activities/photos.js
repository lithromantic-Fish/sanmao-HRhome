const data = require('../../mock/index.js')
const app = getApp()
const { Photo, ActivityImgs} = require('../../utils/Class.js')
const debug = require('../../utils/debug.js')
const login = require('../../utils/login.js')

Page({

  data: {
    photos:[],
    id:null
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id

    })
    this.getImage(this.data.id);
  },
  getImage(id){
    const parms = {
      showLoading: true,
      id:id
    }
    // this.setData({photos:data.photos})
    ActivityImgs.create(parms).then(res => {
      if (res.result == 0) {

        console.log('res', res.data)
        if (res.data == null) {
          this.setData({
            photos: []
          })
        } else {
          this.setData({
            photos: res.data
          })
        }
      } else if (res.result == 999) {
        this.updataApi(id)
      }
    })
  },



  //更新登录过期
  updataApi(id) {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getImage(id)
        })

      }
    })
  },
  preImage(e){
    
    const index = e.currentTarget.dataset.index
    const photos = this.data.photos.map(item=>{
      return app.globalData.uploadUrl+item.PhotoIcon
    })
    wx.previewImage({
      urls:photos,
      current:index
    })
  }




})