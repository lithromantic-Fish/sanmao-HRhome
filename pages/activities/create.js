const app = getApp()
// const debug = require('../../utils/debug')
const login = require('../../utils/login.js')

const eventBus = require('../../utils/eventbus')
// const moment = require('../../vendors/moment.min.js')
const {
  AddActivity,
  SaveFormID,
  ActivityDetailData
  // UpAct
} = require('../../utils/Class')
// const upload = require('../../utils/upload')
const getLocation = require('../../utils/getLocation')

let images = []
// let descImages = []

let loading = false
var toastmsg = {
  "ActivityName": "您还未填写活动名称，请填写",
  "ActivitySite": "您还未填写活动城市，请填写",
  "ActivityIcon": "您还未上传活动图片，请上传",
  "ActivityParticular": "您还未选择活动地址，请选择",
  "InitiatorName": "您还未填写发布身份名称，请填写",
  "ActivityDetails": "您还未填写活动详情，请填写",
  "Cer": "您还未上传资质，请上传",
};

let selt = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    banner_img: '', //上传活动图片
    position: '机构',
    identity: 3, //我的发布身份 2,个人 3,机构
    certificates: [],// 资质身份图片
    username: '', //发布身份名称
    name: '', //活动标题
    Start: {}, //活动开始时间
    End: {}, //活动结束时间
    city: '', //活动城市
    latitude: '',	//纬度，浮点数，范围为-90~90，负数表示南纬	
    longitude:'',	//经度，浮点数，范围为 - 180~180，负数表示西经
    address: '', //活动详细地址
    desc: '',//活动详情介绍
    activity_icon: '',// 活动图片
    imgs: [], //活动详情图片
    diasbled: true,
    formId:null,
    // images: [],
    // descImages: [],
    price: 5
  },


  onLoad: function(options) {
    self = this
    // images = []
    // descImages = []
    
    eventBus.on('qualification', self.saveQualification) //获取上传资质页面的 图片数据

    if (options.id && options.update) {
      console.info(options)
      self.setData({
        options: options
      })
      self.getActivityDetailData()
    }
    
    // eventBus.on('image', self.setImage) //获取上传个人上传照片页面的 图片数据
    // if (options.activity) {
    //   // debug.log('编辑活动===', JSON.parse(options.activity))
    //   let activityObj = JSON.parse(options.activity)
    //   let position = activityObj.Identity === 2 ? '机构' : '个人'
    //   let Start = {
    //     year: moment(activityObj.ActivityATime).format('YYYY'),
    //     month: moment(activityObj.ActivityATime).format('MM'),
    //     day: moment(activityObj.ActivityATime).format('DD'),
    //     hour: moment(activityObj.ActivityATime).format('HH'),
    //     minute: moment(activityObj.ActivityATime).format('mm'),
    //   }
    //   let End = {
    //     year: moment(activityObj.ActivityETime).format('YYYY'),
    //     month: moment(activityObj.ActivityETime).format('MM'),
    //     day: moment(activityObj.ActivityETime).format('DD'),
    //     hour: moment(activityObj.ActivityETime).format('HH'),
    //     minute: moment(activityObj.ActivityETime).format('mm'),
    //   }
    //   let photos = []
    //   let cer = {}
    //   if (activityObj.photos && activityObj.photos.length > 0) {
    //     activityObj.photos.forEach(item => {
    //       photos.unshift(item.PhotoIcon)
    //     })
    //   }
    //   images = photos
    //   if (activityObj.cer && activityObj.cer.length > 0) {
    //     cer.photo1 = activityObj.cer[0].CerImage
    //     cer.photo2 = activityObj.cer[1] ? activityObj.cer[1].CerImage : null
    //   }
    //   let code = String(activityObj.CityCode)
    //   if (activityObj.DescImages && activityObj.DescImages.length > 0) {
    //     descImages = activityObj.DescImages
    //   }
    //   this.setData({
    //     activityId: activityObj.ActivityId,
    //     cover: activityObj.ActivityIcon,
    //     position,
    //     name: activityObj.InitiatorName,
    //     title: activityObj.ActivityName,
    //     End,
    //     Start,
    //     regionText: activityObj.ActivitySite,
    //     address: activityObj.ActivityParticular,
    //     price: activityObj.ActivityPrice,
    //     descImages,
    //     images: photos,
    //     description: activityObj.ActivityDetails,
    //     qualifications: cer,
    //     latitude: activityObj.latitude,
    //     longitude: activityObj.longitude,
    //     location: [activityObj.longitude, activityObj.latitude],
    //     code: code.substring(0, 4),
    //     city: activityObj.ActivitySite,
    //   })
    // }
  },
  getActivityDetailData(){
    let {
      options
    } = self.data
    ActivityDetailData.find(options).then(res=>{
      if (res && res.result ===0) {
        let {
          activity
        } = res.data

        self.setData({
          banner_img: activity.banner_img, //1

          identity: activity.identity, //2.1 - 2,个人 3,机构
          position: activity.identity == 2 ? '个人' : '机构', //2.2 - 2,个人 3,机构
          certificates: activity.certificates, //2.3 - 上传资质图片

          username: activity.username, //3, 发布身份名称
          name: activity.name, //4,活动标题

          Start: activity.Start, //5活动开始时间
          End: activity.End, //6活动结束时间
          
          city: activity.province + ' ' + activity.city, // 7,活动城市

          address: activity.address, // 8,详细地址
          latitude: activity.latitude,	// 纬度，浮点数，范围为-90~90，负数表示南纬	
          longitude: activity.latitude, // 经度，浮点数，范围为 - 180~180，负数表示西经

          activity_icon: activity.activity_icon, // 10, 上传活动图片

          desc: activity.desc, // 11, 活动详情介绍
          imgs: activity.imgs // 12,活动详情图片

        })

      }
    })

  },
  //选择资质 
  choosePosition() {
    let array = ['机构', '个人']
    wx.showActionSheet({
      itemList: array,
      success: res => {
        // console.info('res choosePosition', res)
        self.setData({
          identity: res.tapIndex == 0 ? 3 : 2 ,
          position: array[res.tapIndex],
          certificates:[]//更换身份后,资质图片数组清空
        })
      }
    })
  },
  //时间选择器
  bindPickerChange(e) {
    // debug.log(e)
    const {
      type,
      mode
    } = e.currentTarget.dataset

    if (type === 'date') {
      let array = e.detail.value.split('-')
      // debug.log(array)
      let obj = {
        year: array[0],
        month: array[1],
        day: array[2]
      }
      let Mode = this.data[mode]
      this.setData({
        [mode]: Object.assign(Mode, obj)
      })
    }
    if (type === 'time') {
      let array = e.detail.value.split(':')
      // debug.log(array)
      let obj = {
        hour: array[0],
        minute: array[1],
      }
      let Mode = this.data[mode]
      this.setData({
        [mode]: Object.assign(Mode, obj)
      })
    }

  },
  uploadImage(activity) {
    let Photo = []
    let DescImages = []
    const that = this
    const {
      code,
      city,
      title,
      cover,
      images,
      Start,
      End,
      address,
      price,
      location,
      name,
      description,
      position,
      qualifications,
      longitude,
      latitude,
      descImages
    } = this.data
    for (let index in images) {
      upload.upload(images[index]).then(res3 => {
        Photo.push({
          PhotoIcon: JSON.parse(res3.data).filename
        })
        activity.Photo = Photo
        if (index >= images.length - 1) {
          if (descImages.length > 0) {
            for (let i in descImages) {
              upload.upload(descImages[i]).then(res4 => {
                DescImages.push(JSON.parse(res4.data).filename)
                if (i >= descImages.length - 1) {
                  activity.DescImages = DescImages
                  that.createActivity(activity)
                }
              })
            }
          } else {
            activity.DescImages = []
            that.createActivity(activity)
          }
        }
      })
    }
  },
  // createActivity(activity) {
  //   if (this.data.activityId) {
  //     UpAct.patch(this.data.activityId, activity).then(res => {
  //       // debug.log('创建成功')
  //       wx.hideLoading()
  //       // debug.log(res)
  //       wx.showToast({
  //         title: '创建成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //       setTimeout(() => {
  //         loading = false
  //         wx.navigateBack({
  //           delta: 1
  //         });
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
  //         wx.navigateBack({
  //           delta: 1
  //         });
  //       }, 2000)
  //     })
  //   }
  // },
  gotoQualication() {
    const type = this.data.position === '机构' ? 'institution' : 'person'
    let url = 'qualifications?type=' + type
    const {
      qualifications
    } = this.data
    if (qualifications) {
      url += '&qualifications=' + JSON.stringify(qualifications)
    }
    wx.navigateTo({
      url: url
    })
  },
  gotoMap(e) {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        console.info(res.address)
        // debug.log(res)
        if (res.address) {
          // debug.log(res.name)
          that.setData({
            address: res.name,
            longitude: res.longitude,
            latitude: res.latitude,
            location: [res.longitude, res.latitude],
            diasbled: false,
          })
        }
      },
    })
  },
  //选择城市
  cityChange(e) { 
    getLocation.getLocationData(e.detail.value, res => {
      self.setData({
        city: e.detail.value,
        code: res.result.ad_info.adcode.substr(0, 4)
      })
    })

  },
  //输入框 输入
  // type
  getText(e) {
    let {
      type
    } = e.target.dataset
    let {
      value
    } = e.detail

    self.setData({
      [type]: value
    })
  },
  //获取上传机构资质页面的 图片数据
  saveQualification(photos) {
    let arr = []
    arr.push(photos.photo1)
    arr.push(photos.photo2)
    this.setData({
      certificates: arr
    })
  },
  //获取上传个人上传照片页面的 图片数据
  setImage(e) {
    // debug.log(e)
    return
    this.setData({
      certificates: e.image
    })
  },
  //上传图片 
  // 1,上传活动图片
  chooseCover(e) {
    let {
      type //1,上传活动图片
    } = e.currentTarget.dataset

    console.info('type', type)
    wx.chooseImage({
      count: 1,
      success(res) {
        let tempFilePath = res.tempFilePaths[0]
        wx.showLoading({ title: '图片上传中' })
        wx.uploadFile({
          url: app.globalData.url + '/hr/hrhome/hractivity/ajax_upload_image',
          filePath: tempFilePath,
          name: 'imgFile',
          success(r) {
            let {
              data,
              result,
              msg
            } = JSON.parse(r.data)


            if (result === 0 && data) {
              let { imgUrl } = data
              if (data && imgUrl) {
                switch (parseInt(type)) {
                  case 1: //保存上传的活动图片
                    self.setData({
                      banner_img: imgUrl
                    })
                    break;
                  case 2: //保存上传的活动图片
                    self.setData({
                      activity_icon: imgUrl
                    })
                    break;
                  case 3: //保存上传的活动详情图片
                    self.data.imgs.push(imgUrl)
                    self.setData({
                      imgs: self.data.imgs
                    })
                    break;
                }
              }
            } else {
              wx.showToast({
                title: msg,
                icon: 'none'
              })
            }

            
          },
          complete(res){
            wx.hideLoading()
          }
        })
      }
    })




    return
    // if (type !== 'descImages') {
    //   if (images.length + 9 >= 20) {
    //     imagesCount = 20 - images.length
    //   } else {
    //     imagesCount = 9
    //   }
    //   count = type === 'cover' ? 1 : imagesCount
    // } else {
    //   count = 9
    // }
    // wx.chooseImage({
    //   count: count,
    //   sourceType: ['album', 'camera'], // 指定图片来源
    //   success: res => {
    //     // debug.log(res)
    //     const tempFilePaths = res.tempFilePaths
    //     if (type === 'cover') {
    //       wx.navigateTo({
    //         url: 'crop?image=' + tempFilePaths[0],
    //       })
    //       // this.setData({
    //       //   cover:tempFilePaths[0]
    //       // })

    //     } else if (type === 'descImages') {
    //       descImages = descImages.concat(tempFilePaths)
    //       this.setData({
    //         descImages
    //       })
    //     } else {
    //       images = images.concat(tempFilePaths)
    //       this.setData({
    //         images: images
    //       })
    //     }
    //   }
    // })
  },
  // previewAct(e) {
  //   const {
  //     Start,
  //     End
  //   } = this.data
  //   let starAt = `${Start.year}-${Start.month}-${Start.day} ${Start.hour}:${Start.minute}`
  //   let endAt = `${End.year}-${End.month}-${End.day} ${End.hour}:${End.minute}`

  //   if (moment(starAt).isAfter(moment(endAt))) { //判断时间
  //     wx.showToast({
  //       title: '开始时间不能大于结束时间',
  //       icon: 'none'
  //     })
  //   } else {
  //     const {
  //       city,
  //       title,
  //       cover,
  //       Start,
  //       End,
  //       address,
  //       price,
  //       location,
  //       name,
  //       description,
  //       position,
  //       qualifications,
  //       code,
  //       latitude,
  //       longitude,
  //       descImages
  //     } = this.data
  //     let flag = false
  //     const activity = {
  //       ActivitySite: city,
  //       ActivityName: title,
  //       ActivityIcon: cover,
  //       ActivityPhoto: cover,
  //       photos: images,
  //       ATime: Start,
  //       ETime: End,
  //       ActivityATime: Start.year + '-' + Start.month + '-' + Start.day + ' ' + Start.hour + ':' + Start.minute,
  //       ActivityETime: End.year + '-' + End.month + '-' + End.day + ' ' + End.hour + ':' + End.minute,
  //       InitiatorOpenId: app.globalData.openid,
  //       ActivityParticular: address,
  //       ActivityPrice: price,
  //       latitude,
  //       longitude,
  //       InitiatorName: name,
  //       ActivityDetails: description,
  //       Identity: position === '个人' ? 1 : 2,
  //       Cer: qualifications,
  //       code: code
  //     }
  //     for (let i in activity) {
  //       // debug.log(i + '==', activity[i])
  //       if (!activity[i]) {
  //         flag = true
  //         // debug.log('缺的==', i)
  //         wx.showToast({
  //           title: toastmsg[i],
  //           icon: 'none',
  //         })
  //         return false;
  //       }

  //     }
  //     if (activity["photos"].length == 0) {
  //       wx.showToast({
  //         title: '您还未上传活动图片，请上传',
  //         icon: 'none',
  //       })
  //       return false;
  //     }
  //     if (!Start.year || !Start.month || !Start.day || !Start.hour || !Start.minute ||
  //       !End.year || !End.month || !End.day || !End.hour || !End.minute) {
  //       wx.showToast({
  //         title: '您还选择活动时间，请选择',
  //         icon: 'none',
  //       })
  //       return false;
  //     }
  //     if (!flag) {
  //       if (descImages) {
  //         activity.DescImages = descImages
  //       }
  //       if (this.data.activityId) {
  //         activity.activityId = this.data.activityId
  //       }
  //       wx.navigateTo({
  //         url: 'preview?activity=' + JSON.stringify(activity)
  //       })
  //     }
  //   }
  // },
  // 提交/预览
  confirm(e,btntype) {
    console.log('e',e)

    var formId;
    var btn_type;

    // if (e.detail.formId){
    //   formId = e.detail.formId
    //   //保存formid
    //   SaveFormID.find({ formId: formId })

    // }else{
    //   SaveFormID.find({ formId: this.data.formId })

    // }
    // if (e.detail.target.dataset.btn_type){
    //   btn_type = e.detail.target.dataset.btn_type

    // }else{
    //   btn_type = btn_type
    // }
    if(btntype){
      btn_type = e.detail.target.dataset.btn_type
      formId = e.detail.formId
      //保存formid
      SaveFormID.find({ formId: formId })
    }else{
      formId = e
      btn_type = btntype
      
    }
  


   

      // let {
      //   formId,
      //   target
      // } = e.detail




    
   





    let {
      options,
      banner_img, //上传活动图片
      identity, //我的发布身份 2,个人 3,机构
      certificates,// 资质身份图片
      username, //发布身份名称
      name, //活动标题
      Start, //活动开始时间
      End, //活动结束时间
      city, //活动城市
      latitude, //活动城市 经度
      longitude, //活动城市 维度
      address, //活动详细地址
      desc,//活动详情介绍
      activity_icon,// 活动图片
      imgs, //活动详情图片
      price //价格
    } = self.data
    
    if (!banner_img) {
      wx.showToast({
        title: '您还未上传活动图片，请上传',
        icon: 'none',
      })
      return false;
    }
    if (!certificates.length) {
      wx.showToast({
        title: '您资质身份图片未上传，请上传',
        icon: 'none',
      })
      return false;
    }
    if (!username) {
      wx.showToast({
        title: '请填写您的发布身份',
        icon: 'none',
      })
      return false;
    }
    if (!name) {
      wx.showToast({
        title: '请填写活动标题',
        icon: 'none',
      })
      return false;
    }

    if (!Start.year || !Start.month || !Start.day || !Start.hour || !Start.minute ||
      !End.year || !End.month || !End.day || !End.hour || !End.minute) {
      wx.showToast({
        title: '您还选择活动时间，请选择',
        icon: 'none',
      })
      return false;
    }

    let starAt = `${Start.year}-${Start.month}-${Start.day} ${Start.hour}:${Start.minute}`
    let endAt = `${End.year}-${End.month}-${End.day} ${End.hour}:${End.minute}`

    let _st = new Date(starAt).getTime()
    let _et = new Date(endAt).getTime()

    if (parseInt(_st) > parseInt(_et)) {
      wx.showToast({
        title: '结束时间不得小于开始时间',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    // if (moment(starAt).isAfter(moment(endAt))) { //判断时间
    //   wx.showToast({
    //     title: '开始时间不得大于结束时间',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false
    // }
    if (!city) {
      wx.showToast({
        title: '请选择活动城市',
        icon: 'none',
      })
      return false;
    }
    if (!address) {
      wx.showToast({
        title: '请选择活动城市详细地址',
        icon: 'none',
      })
      return false;
    }
    if (!activity_icon) {
      wx.showToast({
        title: '请上传活动图片',
        icon: 'none',
      })
      return false;
    }
    if (!desc) {
      wx.showToast({
        title: '请填写活动详情介绍',
        icon: 'none',
      })
      return false;
    }

    let prams = {
      showLoading: true,

      banner_img: banner_img, //上传活动图片
      identity: identity, //我的发布身份 2,个人 3,机构
      certificates: certificates,// 资质身份图片
      username: username, //发布身份名称
      name: name, //活动标题
      Start: Start, //活动开始时间
      End: End, //活动结束时间
      starttime: starAt, //拼接好的活动开始时间
      endtime: endAt, //拼接好的活动结束时间
      city: city, //活动城市
      latitude: latitude,//	纬度，浮点数，范围为-90~90，负数表示南纬
      longitude: longitude,//	经度，浮点数，范围为 - 180~180，负数表示西经
      address: address, //活动详细地址
      desc: desc,//活动详情介绍
      activity_icon: activity_icon,// 活动图片
      imgs: imgs, //活动详情图片
      price: price //价格
    }
    console.log(imgs)
    if (imgs==null){
      console.log('进来')
      prams.imgs = ''
    }
    // 如果是预览按钮
    if (btn_type) {
      wx.navigateTo({
        url: '/pages/activities/preview?activity=' + JSON.stringify(prams)
      })
      return false
    }

    if (loading) return
    loading = true

    if (options) {
      Object.assign(prams, options)
    }

    AddActivity.create(prams).then(res=>{
      if (res && res.result ===0) {
        wx.showToast({
          title: res.msg,
          icon: "success"
        })
        if (options) {
          setTimeout(() => {
            wx.navigateBack()

          },1500)
          
        } else {
          wx.redirectTo({
            url: '/pages/account/myActivities?type=2',
          })
        }
      } else  if(res.result==999){
        this.updataApi(formId,btn_type)

        // wx.showToast({
        //   title: res.msg,
        //   icon:"none"
        // })
      }else{
            wx.showToast({
          title: res.msg,
          icon:"none"
        })
      }
      loading = false
    })

  },
  updataApi(formId, btntype) {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.confirm(formId, btntype)                    
        })

      }
    })
  },
  //提交
  // confirm(e) {
  //   const that = this
  //   const {
  //     code,
  //     city,
  //     title,
  //     cover,
  //     images,
  //     Start,
  //     End,
  //     address,
  //     price,
  //     location,
  //     name,
  //     description,
  //     position,
  //     qualifications,
  //     longitude,
  //     latitude,
  //     descImages
  //   } = this.data
  //   let starAt = `${Start.year}-${Start.month}-${Start.day} ${Start.hour}:${Start.minute}`
  //   let endAt = `${End.year}-${End.month}-${End.day} ${End.hour}:${End.minute}`
  //   let form_id = e.detail.formId
  //   let flag = false
  //   let activity = {
  //     ActivitySite: city,
  //     ActivityName: title,
  //     ActivityIcon: cover,
  //     ActivityPhoto: cover,
  //     Photo: images,
  //     ATime: Start,
  //     ETime: End,
  //     ActivityATime: Start.year + '-' + Start.month + '-' + Start.day + ' ' + Start.hour + ':' + Start.minute,
  //     ActivityETime: End.year + '-' + End.month + '-' + End.day + ' ' + End.hour + ':' + End.minute,
  //     ActivityParticular: address,
  //     ActivityPrice: price,
  //     location: location,
  //     InitiatorName: name,
  //     ActivityDetails: description,
  //     Identity: position === '个人' ? 1 : 2,
  //     Cer: qualifications,
  //     code: code,
  //     form_id: form_id,
  //     latitude,
  //     longitude,
  //     InitiatorOpenId: app.globalData.openid,
  //   }
  //   for (let i in activity) {
  //     // debug.log(i + '==', activity[i])
  //     if (!activity[i]) {
  //       flag = true
  //       // debug.log('缺的==', i)
  //       wx.showToast({
  //         title: toastmsg[i],
  //         icon: 'none',
  //       })
  //       return false;
  //     }

  //   }
  //   if (activity["photos"].length == 0) {
  //     wx.showToast({
  //       title: '您还未上传活动图片，请上传',
  //       icon: 'none',
  //     })
  //     return false;
  //   }
  //   if (!Start.year || !Start.month || !Start.day || !Start.hour || !Start.minute ||
  //     !End.year || !End.month || !End.day || !End.hour || !End.minute) {
  //     wx.showToast({
  //       title: '您还选择活动时间，请选择',
  //       icon: 'none',
  //     })
  //     return false;
  //   }
  //   if (!flag) {
  //     // wx.navigateTo({
  //     //   url: 'preview?activity='+JSON.stringify(activity)
  //     // })

  //     if (moment(starAt).isAfter(moment(endAt))) { //判断时间
  //       wx.showToast({
  //         title: '开始时间不得大于结束时间',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     } else {
  //       wx.showLoading({
  //         title: '请稍后',
  //       })
  //       if (loading) {
  //         return
  //       }
  //       loading = true
  //       let Cer = []
  //       let Photo = []
  //       let DescImages = []
  //       upload.upload(cover).then(res => {
  //         // debug.log(res)
  //         activity.ActivityIcon = JSON.parse(res.data).filename
  //         activity.ActivityPhoto = JSON.parse(res.data).filename
  //         if (qualifications.photo1) {
  //           upload.upload(qualifications.photo1).then(res1 => {
  //             Cer.push({
  //               CerImage: JSON.parse(res1.data).filename
  //             })
  //             if (qualifications.photo2) {
  //               upload.upload(qualifications.photo2).then(res2 => {
  //                 Cer.push({
  //                   CerImage: JSON.parse(res2.data).filename
  //                 })
  //               })
  //               activity.Cer = Cer
  //               that.uploadImage(activity)
  //             } else {
  //               activity.Cer = Cer
  //               that.uploadImage(activity)
  //             }
  //           })
  //         } else {
  //           upload.upload(qualifications.photo2).then(res2 => {
  //             Cer.push({
  //               CerImage: JSON.parse(res2.data).filename
  //             })
  //             activity.Cer = Cer
  //             that.uploadImage(activity)
  //           })

  //           // upload.upload(qualifications.photo1).then(res1 => {
  //           //   Cer.push({ CerImage: JSON.parse(res1.data).filename })
  //           //   if (!qualifications.photo2 && position === '机构') {
  //           //   }else{
  //           //     upload.upload(qualifications.photo2).then(res2 => {
  //           //       Cer.push({ CerImage: JSON.parse(res2.data).filename })
  //           //       for (let index in images) {
  //           //         upload.upload(images[index]).then(res3 => {
  //           //           Photo.push({ PhotoIcon: JSON.parse(res3.data).filename })
  //           //           activity.Photo = Photo
  //           //           activity.Cer = Cer
  //           //           if (index >= images.length - 1) {
  //           //             if (descImages.length > 0) {
  //           //               for (let i in descImages) {
  //           //                 upload.upload(descImages[i]).then(res4 => {
  //           //                   DescImages.push(JSON.parse(res4.data).filename)
  //           //                   if (i >= descImages.length - 1) {
  //           //                     activity.DescImages = DescImages
  //           //                     that.createActivity(activity)
  //           //                   }
  //           //                 })
  //           //               }
  //           //             } else {
  //           //               activity.DescImages = []
  //           //               that.createActivity(activity)
  //           //             }
  //           //           }
  //           //         })
  //           //       }
  //           //     })
  //           //   }
  //           // })
  //         }
  //       })
  //     }
  //   }
  // },
  delete(e) {
    // let images = this.data.images
    // let descImages = this.data.descImages
    let {
      index,
      type
    } = e.currentTarget.dataset
  
    // console.info(index,type)

    wx.showModal({
      title: '提示',
      content: '是否删除此图片',
      confirmColor: "#4c89fb",
      success: res => {
        if (res.confirm) {
          // array.splice(index, 1)
          if (type == 2) {
            self.setData({
              activity_icon: ''
            })
          } else if (type == 3) {
            self.data.imgs.splice(index,1)
            self.setData({
              imgs: self.data.imgs
            })
            // descImages = array
          }
          // this.setData({
          //   [type]: array
          // })
        }
      }
    })


  },

})