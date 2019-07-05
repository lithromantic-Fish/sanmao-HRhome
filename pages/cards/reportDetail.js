let images = []
const upload = require('../../utils/upload')
const debug = require('../../utils/debug')
const app = getApp()
const util = require('../../utils/util_wenda');
let config = require('../../config');

const {
  Report
} = require('../../utils/Class')
// const {post} = require('../../utils/http')
let reason
let name
let card_id


Page({

  data: {
    content: '',
    images: [],
    // reason:'',
    // name:'',
    // card_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    reason = options.reason
    name = options.name
    card_id = options.card_id
    images = []
    // this.setData({
    //   reason:options.reason,
    //   name:options.name,
    //   card_id:options.card_id
    // })
    // console.log(reason,name, card_id)
  },
  // 从文件夹中选择图片
  chooseImage() {
    let self = this
    wx.chooseImage({
      count: 1,
      success: res => {
        console.info('images', typeof(images))
        console.info('res.tempFilePaths', typeof(res.tempFilePaths))
        let _tempFilePaths = res.tempFilePaths[0]
        // images = images.concat(_tempFilePaths);
        // console.log(images);
        // this.setData({
        //   images
        // })
        wx.uploadFile({
          url: app.globalData.url + '/hr/hrhome/hractivity/ajax_upload_image',
          filePath: _tempFilePaths,
          name: 'imgFile',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success(res) {
            // do something
            let {
              data
            } = JSON.parse(res.data)
            if (data && data.imgUrl) {
              images = images.concat(data.imgUrl);
              self.setData({
                images: images
              })
            }
          }
        })
      }
    })
  },
  // 获取填写的文本内容
  getText(e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  // 删除图片
  clearPhoto(e) {
    let {
      index
    } = e.currentTarget.dataset
    images.splice(index, 1)
    this.setData({
      images: images
    })
  },
  // 提交填写的举报页面
  submit() {
    let self = this
    // if (images.length > 0) {
    // let i = 1
    // let imageUrls = []
    // for(i in images){
    //   console.log('当前是第'+i+'张图片')
    //   upload.upload(images[i]).then(res=>{
    //     debug.log(res)
    //     console.log(res)
    //     debug.log(res.data)
    //     let obj = res.data
    //     let RepImage = obj.filename
    //     imageUrls.push({RepImage})
    //     console.log(imageUrls+'=======',this.data.card_id+'==========',this.data.reason)
    //     if(i == images.length-1){
    //       console.log('imageUrls===',imageUrls)
    //       const data = {
    //         // "ReportName":app.globalData.card.BusName,
    //         "card_id":card_id, 
    //         "reasons":reason,
    //         "concent":this.data.content,
    //         // "ReportedName":name,
    //         // "Reportedcard_id":card_id,
    //         "imglist":images
    //       }
    //       console.log(data)
    //       Report.find(data).then(res=>{
    //         console.log(res)
    //         wx.showToast({
    //           title:'举报成功',
    //           duration:2000,
    //           icon:'success'
    //         })
    //         setTimeout(() => {
    //           wx.navigateBack({ 
    //             delta: 2, 
    //           });
    //         }, 2000);
    //       })
    //     }
    //   })

    // }
    const params = {
      showLoading: true,

      "card_id": card_id,
      "reasons": reason,
      "content": self.data.content,
      "imglist": self.data.images
    }
    // console.info(params)


    util.request({
      url: config.apiUrl + Report,
      autoHideLoading: false,
      data: params,
      method: "POST",
      withSessionKey: true
    }, this.submit).then(res => {

      // if (res.result == 0) {
    // Report.create(params).then(res => {
      // console.info(res)
      if (res) {
        let _txt = ''
        let _icon = ''
        if (res.result == 0) {
          _txt = '举报成功' 
          _icon: 'success'
          setTimeout(() => {
            wx.navigateBack({
              delta: 2,
            });
          }, 2000);
        wx.showToast({
          title: _txt,
          icon: _icon,
          duration: 2000
        })
        }else if(res.result==999){
      
        } else {
          _icon = 'none'
          _txt = res.msg
          wx.showToast({
            title: _txt,
            icon: _icon,
            duration: 2000
          })
        }
      } 

    })
    // } else {
    //   const params = {
    //     // "ReportName": app.globalData.card.BusName,
    //     "card_id": card_id,
    //     "reasons": reason,
    //     "content": this.data.content,
    //     // "ReportedName": name,
    //     // "Reportedcard_id": card_id,
    //     "imglist": []
    //   }
    //   Report.create(params).then(res => {
    //     console.log(res)
    //     return
    //     wx.showToast({
    //       title: '举报成功',
    //       duration: 2000,
    //       icon: 'success'
    //     })
    //     setTimeout(() => {
    //       wx.navigateBack({
    //         delta: 2,
    //       });
    //     }, 2000);
    //   })
    // }
  }
})