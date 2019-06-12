const app = getApp()
const debug = require('../../utils/debug')
const eventBus = require('../../utils/eventbus')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo1: '',
    photo2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const type = options.type
    this.setData({
      type
    })
    if (options.qualifications) {
      let qualificationPhoto = JSON.parse(options.qualifications)
      this.setData({
        photo1: qualificationPhoto.photo1,
        photo2: qualificationPhoto.photo2,
      })
    }

  },

  choosedImage(e) {
    const type = e.currentTarget.dataset.photo
    // wx.chooseImage({
    //   count: 1,	// 默认为9
    //   sourceType: ['album', 'camera'],	// 指定图片来源
    //   success: res=> {
    //    const tempFilePaths = res.tempFilePaths
    //    this.setData({
    //     [type]:tempFilePaths[0]
    //    })
    //   }
    // })
    let self = this
    wx.chooseImage({
      count: 1,
      success(res) {
        let tempFilePath = res.tempFilePaths[0]
        wx.showLoading({
          title: '图片上传中'
        })
        wx.uploadFile({
          url: app.globalData.url + '/hr/hrhome/hractivity/ajax_upload_image',
          filePath: tempFilePath,
          name: 'imgFile',
          // header: {
          //   'Content-Type': 'multipart/form-data'
          // },
          // formData: {
          //   hrhome_token: wx.getStorageInfoSync('hrhome_token')
          // },
          success(r) {
            // do something
            let {
              data
            } = JSON.parse(r.data)

            if (data && data.imgUrl) {
              self.setData({
                [type]: data.imgUrl
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  submit() {
    const {
      photo1,
      photo2,
      type
    } = this.data
    let txt = ""
    let flag = false
    if (type === 'institution') {
      flag = photo1 || photo2 ? true : false
    } else {
      flag = photo1 && photo2 ? true : false
    }
    if (!flag) {

      txt = type == 'institution' ? "请上传资质照片" : "请上传身份证照片"
      wx.showToast({
        title: txt,
        duration: 2000,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '上传成功',
        duration: 2000
      })
      eventBus.emit('qualification', {
        photo1,
        photo2,
        type: this.data.type
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    }
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})