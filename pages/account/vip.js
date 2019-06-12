const {
  VipStatus,
  SaveFormID
  // Plus,
  // MyCard
} = require('../../utils/Class.js')
const app = getApp()
let self = {}

Page({

  data: {
    v_card: '', //名片
    type: 1, //1名片 2工牌
    preImage: '', //预览图
    status: 0, //1:未申请；2:申请审核中；3:审核通过；4:未通过
  },

  onLoad(options) {
    self = this

    self.getData()
  },
  //获取我的加v特权
  getData() {

    VipStatus.find().then(res => {
      if (res && res.result === 0) {
        let {
          v_status,
          v_card
        } = res.data

        self.setData({
          status: v_status,
          v_card: v_card
          // preImage: card || work_card
        })

        // card && self.setData({
        //   type: 1,
        //   card: card
        // })
        // work_card && self.setData({
        //   type: 2,
        //   work_card: work_card
        // })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack()
        }, 2000)
      }
    })

  },
  //选择图片上传
  choosedImage(e) {
    let {
      type
    } = e.currentTarget.dataset
    let {
      formId
    } = e.detail
    // console.info(e, type, formId)

    //收集formid
    SaveFormID.find({
      formId: formId
    })

    if (type ==3) return


    //图片上传
    wx.chooseImage({
      count: 1,
      success(res) {
        let tempFilePaths = res.tempFilePaths[0]

        wx.showLoading({
          title: '图片正在上传'
        })

        wx.uploadFile({
          url: app.globalData.url + '/hr/hrhome/hractivity/ajax_upload_image',
          filePath: tempFilePaths,
          name: 'imgFile',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success(r) {
            // do something
            let {
              data
            } = JSON.parse(r.data)
            if (data && data.imgUrl) {
              self.setData({
                type: type,
                preImage: data.imgUrl
              })
              // if (type == 1) {
              //   self.setData({
              //     card: data.imgUrl
              //   })
              // } else if (type == 2) {
              //   self.setData({
              //     work_card: data.imgUrl
              //   })
              // }
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  //提交审核
  submit(e) {
    let {
      formId,
      target
    } = e.detail

    let {
      disabled
    } = target.dataset

    let {
      type,
      preImage
    } = self.data

    //收集formid
    SaveFormID.find({
      formId: formId
    })

    if (disabled) return

    if (preImage) {
      let prams = {
        "dosubmit": true,
        v_card: preImage, 
      }
      VipStatus.find(prams).then(res => {
        if (res && res.result === 0) {
          self.setData({
            status: 2
          })
          wx.showToast({
            title: '提交审核成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none',
        duration: 1000
      })
    }

  }

})