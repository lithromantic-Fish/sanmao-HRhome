const app = getApp()

// const moment = require('../../vendors/moment.min.js')
const {
  Activity,
  SaveFormID,
  ActivityDetailData,
  AddActivity,
  ExportApplylist,
  // ActDelLike,
} = require('../../utils/Class.js')

let loading = false
let self = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    preview: false, //是否预览
    activity: {}, //获取的活动数据
    applyList:[],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this

    // console.info(options)
    // activity = null
    // activityDetail = null
    // photos = null
    // id = null
  console.log(options)
    if (options.activity) {

      // debug.log(activity)
      self.setData({
        activity: JSON.parse(options.activity),
        preview: true
      })
    } else if (options.id) {
      //如果有id 则通过活动id去取
      self.setData({
        id: options.id
      })
    }

  },
  onShow() {
    self = this
    //如果是修改编辑以后回来的就刷新数据
    if (self.data.id) {
      self.getActivity()
    }
  },
  getActivity() {
    ActivityDetailData.find({ id: self.data.id }).then(res => {
      if (res && res.result === 0) {
        let {
          activity
        } = res.data
        console.log("activity",res.data)
        // console.info(activity)
        self.setData({
          activity: activity,
          applyList: res.data.applys
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    })
  },
  edit() {
    wx.navigateBack({
      delta: 1
    });
  },
  //签到二维码查看
  signImage(e){
    console.log('e',e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/activities/signView?id=' + e.currentTarget.dataset.item.id,
    })
  },
  //导出报名表
  outSignExecl() {
    console.log("1111", wx.getStorageSync('hrhome_token')) 
    const  hrToken = wx.getStorageSync('hrhome_token')
    const parms = {
      activity_id: this.data.activity.id
    }
    ExportApplylist.create(parms).then(res=>{
    let url = res.data
    wx.downloadFile({
      url: url,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log('tempFilePaths', res.tempFilePath)
              const tempFilePaths = res.tempFilePath
              wx.openDocument({
                filePath: tempFilePaths,
                fileType:'xlsx',
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail:function(err){
                  console.log(err)
                }
              })
        }
      }
    })
    })

  },
  //重新编辑活动
  update(){
    let {
      activity
    } = self.data
    wx.navigateTo({
      url: '/pages/activities/create?update=1&id=' + activity.id,
    })
  },
  signDetail(e) {
    let {
      formId
    } = e.detail

    //保存formid
    SaveFormID.find({
      formId: formId
    })
    console.log(e)
    
    wx.navigateTo({
      url: '/pages/activities/allSign?id=' + self.data.activity.id
    })
  },
  submit(e) {

    let {
      formId
    } = e.detail

    //保存formid
    SaveFormID.find({
      formId: formId
    })

    if (loading) {
      return
    }
    loading = true

    wx.showLoading({
      title: '请稍后',
    })

    let prams = {}
    let _data = self.data.activity

    for (let k in _data) {
      prams[k] = _data[k]
    }

    AddActivity.create(prams).then(res => {
      if (res && res.result === 0) {
        wx.showToast({
          title: res.msg,
          icon: "success"
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
      loading = false
    })

    // let Cer = []
    // let Photo = []
    // let DescImages = []
    // activity.form_id = form_id
    // upload.upload(activity.ActivityIcon).then(res => {
    //   activity.ActivityIcon = JSON.parse(res.data).filename
    //   activity.ActivityPhoto = JSON.parse(res.data).filename
    //   if (activity.Cer.photo1) {
    //     upload.upload(activity.Cer.photo1).then(res1 => {
    //       Cer.push({
    //         CerImage: JSON.parse(res1.data).filename
    //       })
    //       if (activity.Cer.photo2) {
    //         upload.upload(activity.Cer.photo2).then(res2 => {
    //           Cer.push({
    //             CerImage: JSON.parse(res2.data).filename
    //           })
    //         })
    //         activity.Cer = Cer
    //         that.uploadImage(activity)
    //       } else {
    //         activity.Cer = Cer
    //         that.uploadImage(activity)
    //       }
    //     })
    //   } else {
    //     upload.upload(activity.Cer.photo2).then(res2 => {
    //       Cer.push({
    //         CerImage: JSON.parse(res2.data).filename
    //       })
    //     })
    //     activity.Cer = Cer
    //     that.uploadImage(activity)
    //   }



    //   // else{
    //   //   upload.upload(activity.Cer.photo1).then(res1 => {
    //   //     Cer.push({ CerImage: JSON.parse(res1.data).filename })
    //   //     if (!activity.Cer.photo2 && activity.Identity === 2) {  
    //   //     }else{
    //   //       upload.upload(activity.Cer.photo2).then(res2 => {
    //   //         Cer.push({ CerImage: JSON.parse(res2.data).filename })
    //   //         for (let index in activity.photos) {
    //   //           upload.upload(activity.photos[index]).then(res3 => {
    //   //             Photo.push({ PhotoIcon: JSON.parse(res3.data).filename })
    //   //             activity.Photo = Photo
    //   //             activity.Cer = Cer
    //   //             if (index >= activity.photos.length - 1) {
    //   //               if (activity.DescImages.length > 0) {
    //   //                 for (let i in activity.DescImages) {
    //   //                   upload.upload(activity.DescImages[i]).then(res4 => {
    //   //                     DescImages.push(JSON.parse(res4.data).filename)
    //   //                     if (i >= activity.DescImages.length - 1) {
    //   //                       activity.DescImages = DescImages
    //   //                       that.createActivity(activity)
    //   //                     }
    //   //                   })
    //   //                 }
    //   //               } else {
    //   //                 activity.DescImages = []
    //   //                 that.createActivity(activity)
    //   //               }
    //   //             }
    //   //           })
    //   //         }
    //   //       })
    //   //     }

    //   //   })
    //   // }

    // })

  },
  // uploadImage(activity) {
  //   let Photo = []
  //   let DescImages = []
  //   const that = this
  //   for (let index in activity.photos) {
  //     upload.upload(activity.photos[index]).then(res3 => {
  //       Photo.push({
  //         PhotoIcon: JSON.parse(res3.data).filename
  //       })
  //       activity.Photo = Photo
  //       if (index >= activity.photos.length - 1) {
  //         if (activity.DescImages.length > 0) {
  //           for (let i in activity.DescImages) {
  //             upload.upload(activity.DescImages[i]).then(res4 => {
  //               DescImages.push(JSON.parse(res4.data).filename)
  //               if (i >= activity.DescImages.length - 1) {
  //                 activity.DescImages = DescImages
  //                 that.createActivity(activity)
  //               }
  //             })
  //           }
  //         } else {
  //           activity.DescImages = []
  //           that.createActivity(activity)
  //         }
  //       }
  //     })
  //   }
  // },
  // createActivity(activity) {
  //   if (this.data.activity.activityId) {
  //     delete activity.activityId
  //     UpAct.patch(this.data.activity.activityId, activity).then(res => {
  //       wx.hideLoading()
  //       // debug.log('修改成功')
  //       wx.hideLoading()
  //       // debug.log(res)
  //       wx.showToast({
  //         title: '修改成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //       setTimeout(() => {
  //         loading = false
  //         wx.reLaunch({
  //           url: '../account/myActivities',
  //         })
  //       }, 2000)
  //     })
  //   } else {
  //     AddActivity.create(activity).then(res => {
  //       wx.hideLoading()
  //       // debug.log('创建成功')
  //       // debug.log(res)
  //       wx.showToast({
  //         title: '创建成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //       setTimeout(() => {
  //         loading = false
  //         wx.reLaunch({
  //           url: '../account/myActivities',
  //         })
  //       }, 2000)
  //     })
  //   }

  //   // AddActivity.create(activity).then(res => {
  //   debug.log('创建成功')
  //   debug.log(res)
  //   //   wx.showToast({
  //   //     title: '创建成功',
  //   //     icon: 'success',
  //   //     duration: 2000
  //   //   })
  //   //   setTimeout(() => {
  //   //     wx.reLaunch({
  //   //       url: '../account/myActivities',
  //   //     })
  //   //   }, 2000)
  //   // })
  // },
 
  preview() {
    if (this.data.preview) {
      return
    }
    wx.navigateTo({
      url: 'photos?id=' + this.data.activity.id
    })
  },
  gotoMap() {
    const that = this;
    wx.getLocation({
      success: function(res) {
        if (activity.longitude && activity.latitude) {
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
              // debug.log(res);
              wx.openLocation({
                latitude: parseFloat(activity.latitude),
                longitude: parseFloat(activity.longitude),
                scale: 28,
                name: activity.ActivityParticular,
                address: activity.ActivityParticular,
              })
            }
          })
        }
      },
    })

  },
  detail() {
    console.log(this.data.preview)
    if (this.data.preview) {
      return
    }
    wx.navigateTo({
      url: 'detail?activeContent=' + JSON.stringify(this.data.activity.desc) + '&images=' + JSON.stringify(this.data.activity.imgs)+'&id=' + this.data.activity.id 
    })
  },
})