// pages/activities/signView.js
const {
  SignImg
} = require('../../utils/Class.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signImage :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    self = this
  const parms = {
    id: options.id
  }
    SignImg.find(parms).then(res => {
      // console.info(res)
      if (res && res.result === 0) {
        let data = res.data
        self.setData({
          signImage: data
        })
      }
    })

  },
  save() {
    const file = wx.getFileSystemManager();
    let {
      signImage
    } = self.data

    if (!signImage) {
      wx.showToast({
        title: '签到二维码不存在',
        icon: 'none'
      })
      return
    }

    file.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/sign.png',
      data: signImage.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/sign.png',
          success: function (res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (err) {
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
    //   filePath: this.data.signImage,
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})