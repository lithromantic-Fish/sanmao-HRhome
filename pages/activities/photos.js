const data = require('../../mock/index.js')
const app = getApp()
const { Photo, ActivityImgs} = require('../../utils/Class.js')
const debug = require('../../utils/debug.js')
Page({

  data: {
    photos:[],
  },

  onLoad: function (options) {
    console.log(options)
    const parms = {
      id:options.id
    }
    // this.setData({photos:data.photos})
    ActivityImgs.create(parms).then(res=>{
      console.log('res',res)
      this.setData({
        photos:res.data
      })
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