const app = getApp()

const {
  CardImg
} = require('../../utils/Class.js')

let self = {}

Page({

  data: {
    shareImage: ""
  },

  onLoad: function(options) {
    self = this

    const card = wx.getStorageSync('card')
    self.setData({
      card: card
    })

    CardImg.find().then(res => {
      // console.info(res)
      if (res && res.result === 0) {
        let data = res.data
        self.setData({
          shareImage: data
        })
      }
    })

    // const data = {
    //   scene: 'avatar',
    //   path: '/pages/cards/cardDetail?id=' + card.OpenId + '&busid=' + card.BusId,
    //   width: 100,
    //   avatarUrl: formatAvatar(card.BusIcon)
    // }
    // LogoQrcode.create(data).then(res => {
    //   debug.log(res)
    //   let shareImage = 'data:image/jpeg;base64,' + res.sharePic
    //   this.setData({
    //     shareImage
    //   })
    // })
  },
  save() {
    const file = wx.getFileSystemManager();
    let {
      shareImage
    } = self.data
    
    if (!shareImage) {
      wx.showToast({
        title: '名片二维码不存在',
        icon: 'none'
      })
      return
    }

    file.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/mycard.png',
      data: shareImage.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/mycard.png',
          success: function(res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function(err) {
            console.log(err)
          }
        })
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
    // wx.saveImageToPhotosAlbum({
    //   filePath: this.data.shareImage,
    //   success: res => {
    //     wx.showToast({
    //       title: '保存成功',
    //       icon: 'success',
    //       duration: 2000,
    //     })
    //   },
    //   fail:res=>{
    //     debug.log(res)
    //   }
    // })
  }



})