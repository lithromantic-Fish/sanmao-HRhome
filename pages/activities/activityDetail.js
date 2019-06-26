const data = require('../../mock/index')
const app = getApp();
const debug = require('../../utils/debug.js')
const http = require('../../utils/http')
const moment = require('../../vendors/moment.min.js')
const QR = require('../../utils/qrcode.js')
const base64src = require('../../utils/base64src .js')
let util = require('../../utils/util_wenda');
let config = require('../../config');
const {
  ActivityDetailData,
  CheckApply,
  CancelApply,
  SaveFormID,
  ExportApplylist,
  ActivityQbcode
} = require('../../utils/Class')
const {
  regeneratorRuntime
} = global
// import { base64src } from '../../utils/base64src.js'
const {
  Activity,
  GetPageUrl,
  Photo,
  Apply,
  MyFavorite,
  LogoQrcode,
  ActLike,
  ZanActivity,
  ActDelLike,
  FavActivity
} = require('../../utils/Class.js')
const WxParse = require('../../vendors/wxParse/wxParse.js');
let photos = []

function formatAvatar(avatar) {
  const fdStart = avatar.indexOf("https://wx.qlogo.cn/");
  const start = avatar.indexOf("http://tmp/");
  if (avatar) {
    if (fdStart === 0 || start === 0) {
      return avatar
    } else {
      return app.globalData.uploadUrl + avatar
    }
  } else {
    return 'https://static.hrloo.com/hrloo56/hrhomeminiapp/img/default.jpg'
  }
}

function getImage(image, callBack) {
  wx.downloadFile({
    url: image,
    success: res => {
      callBack(res)
    }
  })
}
let activity = null
let tempFilePath = null
let id
let activityDetail = null
let likeLoading = false
Page({
  data: {
    shareImage: '',
    favor: false,
    showShare: false,
    photos: photos,
    fullMask: false,
    codePath: null,
    photosNum: null,
    comment: 0,
    activity: {},
    applys: [],
    like: 0,
    activityId: null,
    isLogin:false,
    Status: {
      "0": "未开始",
      "1": "进行中",
      "2": "已结束",
    },
    card:{}
  },
  onLoad: function(options) {
    // console.log(options)
    id = options.id
    // activity = null
    tempFilePath = null
    photos = null
    activityDetail = null
    this.setData({
      width: wx.getSystemInfoSync().windowWidth,
      activityId: options.id,
      sign: options.sign || '',
      card: wx.getStorageSync('card') || app.globalData.card
      // activity:data.activityDetail
    })

    if (options.scene) {
      GetPageUrl.find({
        scene: options.scene
      }).then(res=>{
        if (res.result == 0) {
          wx.redirectTo({
            url: '/' + res.data.path
          })
        }else {
          console.log('没拿到数据')
        }
      })
    } else {
      this.getActivity();
    }
    
    console.log("card", this.data.card)
    console.log("card", wx.getStorageSync('card'))
    console.log("card", app.globalData.card)
  },


  //没有名片
  noCard(){
    wx.showModal({
      title: '提示',
      content: '您还没有名片，是否立即前往',//已埋登录
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../cards/makeCard',
          })
        }
      }
    })
  },
  onShow() {
    this.setData({
      isLogin: util._getStorageSync('isLogin') == 1 ? true : false
    })
    // this.getActivity();
  },

  //拉起手机授权
  _getPhoneNumber: function (res) {
    console.log(res.detail.encryptedData)
    console.log(res.detail.iv)
    let data = res.detail
    if (data.encryptedData && data.iv) {
      this._confirmEvent(data)
    } else {
      util.gotoPage({
        url: '/pages/login/login'
      })
    }

  },

  /**
   * 获取手机号码回调
   */
  _confirmEvent: function (opts) {
    console.log(opts)
    let self = this
    let data = {}

    if (opts.currentTarget) {
      data = arguments[0].detail.getPhoneNumberData
    } else {
      data = {
        encryptedData: opts.encryptedData,
        iv: opts.iv
      }
    }
    // console.info('opts', opts)

    util.request({
      url: config.apiUrl + '/hr/special/wxapp/autoRegister',
      data: data,
      autoHideLoading: false,

      method: "POST",
      withSessionKey: true
    }).then(res => {

      if (res.result == 0) {
        util._setStorageSync('isLogin', 1)
        self.setData({
          ['isLogin']: true
        })
        //授权后重新获取详情页数据
        this.getCommentList();
        this.getIndexData();
        util.runFn(self.getInitData)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    })
  },

  //导出报名表
  outSignExecl(){
    if (!this.data.card) {
      this.noCard()
    } else {
      const parms = {
        activity_id: this.data.activityId
      }
      ExportApplylist.create(parms).then(res => {
        console.log(res)
        if (res.result == 0) {
        
        }
      })
    }
  },
  close() {
    this.setData({
      fullMask: false
    })
  },
  // onPullDownRefresh: function () {
  //   const parms = {
  //     id: this.data.activityId
  //   }
  //   this.getActivity(parms).then(res => {
  //     wx.hideNavigationBarLoading()
  //     wx.stopPullDownRefresh()
  //   })
  // },
  //获取活动详情
  getActivity() {
    const parms = {
      sign: this.data.sign,
      id: this.data.activityId
    }

    ActivityDetailData.create(parms).then(res => {
      console.log(res)
      if (res.result == 0) {
        if (res.data.activity.status == 0 && res.data.activity.auth == 0) {
          wx.showToast({
            title: '该活动不存在',
            icon: "none"
          })
        } else {
          if (res.data.activity.auth == 1) {
            wx.redirectTo({
              url: 'preview?id=' + res.data.activity.id
            })
            return
          }
          this.setData({
            activity: res.data.activity,
            applys: res.data.applys
          })
        }
      }
    })
  },
  //搜集formID
  collectFormID(formID) {
    console.log('formID', formID)
    SaveFormID.find({
      formId: formID
    });
  },
  //去活动详情页面
  toMore() {
    console.log("111111111111111", this.data)
    console.log(this.data.activity.imgs)
    wx.navigateTo({
      url: 'detail?images=' + JSON.stringify(this.data.activity.imgs) + '&id=' + this.data.activity.id
    })
  },
  // getActivity(id){
  //   const that = this
  //   const Id = id
  //   debug.log(Id)
  //   return Activity.get(`${app.globalData.openid}/${id}`).then(res=>{
  //     debug.log(res)
  //     console.log(res)
  //     activityDetail = res
  //     activity = res.list[0]
  //     let favor = res.collect?true:false
  //     var temp = WxParse.wxParse('article', 'html', activity.ActivityDetails, that, 5);
  //     this.setData({ activity: activity, appAvatars: res.res, activityDetail: activityDetail, article: temp, favor: favor, like: res.likecount, comment: res.comcount, isapply: res.isapply, iscollect: res.iscollect, issign: res.issign, isLike: res.isLike,isRole:res.isRole})

  //     const t1 = moment(activity.ActivityATime * 1000)
  //     const t2 = moment()
  //     const t3 = moment(activity.ActivityETime * 1000)
  //     // console.log(t2,t1)
  //     let status = 0
  //     if (t2.isBetween(t1,t3) ) {
  //       console.log('活动开始了')
  //       status = 1
  //     }else if(t2.isBefore(t1)){
  //       console.log('活动未开始')
  //       status = -1
  //     } else if(t2.isAfter(t3)){
  //       console.log('活动结束')
  //       status = 2
  //     }
  //     this.setData({ status: status })
  //   }).then(()=>{
  //     Photo.get(id).then(res1=>{
  //       debug.log('Photo===',res1.list)
  //       photos = res1.list.data
  //       Object.assign(activity,{photos})
  //       this.setData({ activity})
  //     })
  //   })
  //   .then(()=>{MyFavorite.get(app.globalData.openid).then(res2=>{
  //     debug.log(res2)
  //     const myFavor = res2.list 
  //     debug.log(myFavor)
  //     myFavor.forEach(item=>{
  //       if (item.ActivityId == id){
  //          that.setData({favor:true})
  //       }
  //     })
  // })})
  // },

  scan() {
    if (this.data.card) {
      wx.scanCode({
        onlyFromCamera: true,
        success: res => {
          // debug.log(res)
          if (res && res.path) {
            console.log("活动内页扫码签到",res)
            wx.redirectTo({
              url: '/'+res.path,
            })
          }
        }
      })
    } else {
      this.noCard()
    }
  },
  gotoMap() {
    const that = this;
    wx.getLocation({
      success: function(res) {
        if (activity.longitude && activity.latitude) {
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
              debug.log(res);
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
  gotoCards() {
    wx.switchTab({
      url: '/pages/cards/cards',
    })
  },
  favor(e) {
    // if(likeLoading){
    //   return 
    // }
    // likeLoading=true
    const that = this
    if (this.data.card) {
      console.log(this.data.activity)
      const parms = {
        activity_id: this.data.activity.id
      }
      FavActivity.create(parms).then(res => {
        if (res.result == 0) {
          if (e.detail.formId) {
            this.collectFormID(e.detail.formId)

          }
          this.getActivity();

        }
      })
      // if (!iscollect){
      //   http.put(`/act/B/${app.globalData.openid}/A/${activity.ActivityId}`).then(res => {
      //     likeLoading = false
      //     if (res.data.status) {
      //       this.setData({
      //         iscollect: !iscollect
      //       })
      //     }
      //   })
      // }else{
      //   http.post(`/act/B/${app.globalData.openid}/A/${activity.ActivityId}`).then(res => {
      //     likeLoading = false
      //     if (res.data.status) {
      //       this.setData({
      //         iscollect: !iscollect
      //       })
      //     }
      //   })
      // }
    } else {
      likeLoading = false
      this.noCard()
    }
  },

  shareActivity(e) {
    if (!this.data.card) {
      this.noCard()
    } else {

      console.log('thisdarastaus', this.data.activity.status)
      if (this.data.activity.status == 0) {
        wx.showToast({
          icon: 'none',
          title: '该活动还在审核中，无法转发',
        })
        return
      }
      if (e.detail.formId) {
        this.collectFormID(e.detail.formId)

      }
      const {
        showShare
      } = this.data;
      this.setData({
        showShare: !showShare
      })
    }
  },

  sharePYQ() {
    const that = this;
    this.setData({
      // fullMask :true,
      showShare: false
    })
    wx.showToast({
      title: '生成中',
      icon: 'loading',
    });
    setTimeout(function() {
      wx.hideToast();
      that.getSharePost();
    }, 1000)
  },
  getSharePost() {
    wx.showLoading({
      title: '正佳加载',
    })
    const that = this;
    // const data = {
    //   scene: 'activity',
    //   path: '/pages/activities/activityDetail?id=' +this.data.activity_id,
    //   width: 100,
    //   avatarUrl: formatAvatar(activity.ActivityPhoto)
    // }
    const parms = {
      activity_id: this.data.activity.id
    }

    ActivityQbcode.create(parms).then(res => {
      // console.log('phote=====',res.data)
      if (res.result == 0) {
        this.setData({
          shareImage: res.data,
          fullMask: true
        })
      }
      // let shareImage = 'data:image/jpeg;base64,' + res.data
      // base64src.base64src(shareImage, res => {
      //   console.log('image==',res) // 返回图片地址，直接赋值到image标签即可
      //   // this.getPost(res)
      // });


    })
    //之前就没有的
    // QR.api.draw('/pages/activityDetail/activityDetail', 'mycanvas2', 200, 200);
    // wx.canvasToTempFilePath({
    //   canvasId: 'mycanvas2',
    //   success:res=> {
    //     let path = res.tempFilePath;
    //     this.getPost(path)
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // });
  },
  getPost(codePath) {
    console.log(codePath)
    const that = this
    const canvas = wx.createCanvasContext('mycanvas');
    let temp1 = formatAvatar(activity.ActivityPhoto)
    let temp2 = formatAvatar(activity.ActivityIcon)
    let temp3 = formatAvatar(this.data.card.BusIcon)
    let path_bg = null
    let avatar = null
    let image = null
    getImage(temp1, res1 => {
      debug.log(res1)
      path_bg = res1.tempFilePath
      getImage(temp2, res2 => {
        debug.log(res2)
        image = res2.tempFilePath
        getImage(temp3, res3 => {
          debug.log(res3)
          avatar = res3.tempFilePath
          debug.log(path_bg, image, avatar)
          const nickName = this.data.card.BusName
          const title = `【${activity.ActivitySite}】${activity.ActivityName}`;
          canvas.setFillStyle("#fff")
          canvas.fillRect(0, 0, 750, 1334)
          canvas.drawImage(avatar, 25, 25, 120, 120);
          canvas.setFontSize(40);
          canvas.setFillStyle('#3b434b');
          canvas.setTextAlign('left');
          canvas.stroke();
          canvas.fillText(`我是${nickName}`, 160, 80);
          canvas.setFontSize(30);
          canvas.setFillStyle('#3b434b');
          canvas.setTextAlign('left');
          canvas.stroke();
          canvas.fillText(`邀请您来参加`, 160, 130);
          canvas.drawImage(image, 25, 300, 700, 373);
          canvas.setFontSize(40);
          canvas.setFillStyle('#3b434b');
          canvas.setTextAlign('left');
          canvas.fillText(title, 25, 740);
          canvas.setFontSize(28);
          canvas.setFillStyle('#3b434b');
          canvas.setTextAlign('left');
          canvas.fillText(`时间:${moment(activity.ActivityATime * 1000).format('YYYY年MM月DD日 HH:mm')}-${moment(activity.ActivityETime * 1000).format('YYYY年MM月DD日 HH:mm')}`, 50, 800);
          canvas.setFontSize(35);
          canvas.setFillStyle('#3b434b');
          canvas.setTextAlign('left');
          canvas.fillText(`地点:${activity.ActivityParticular}`, 50, 850);
          canvas.setFontSize(35);
          canvas.setFillStyle('#3b434b');
          canvas.setTextAlign('left');
          canvas.fillText(`长按二维码扫描即可参与`, 50, 1280);
          canvas.drawImage(codePath, 520, 1120, 200, 200);
          canvas.draw();
          canvas.save();
          setTimeout(function() {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              success: res => {
                wx.hideLoading()
                console.log(res);
                tempFilePath = res.tempFilePath;
                that.setData({
                  imagepath: tempFilePath
                })
              },
              fail: function(res) {
                wx.hideLoading()
                console.log(res);
                wx.showToast({
                  title: '加载失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          }, 2000)
        })
      })
    })


    //  getImage(temp2)
    // getImage(temp3) //to do
    // debug.log(path_bg, image, avatar)

  },
  like(e) {
    if (this.data.card) {


      const that = this
      console.log(this.data.activity)
      const parms = {
        activity_id: this.data.activity.id
      }
      ZanActivity.create(parms).then(res => {
        if (e.detail.formId) {
          this.collectFormID(e.detail.formId)

        }
        this.getActivity();
      })

      // const data = {
      //   "ActivityId": activity.ActivityId,
      //   "OpenId": app.globalData.openid
      // }
      // if (this.data.isLike) {
      //   ActDelLike.create(data).then(res => {
      //     this.setData({
      //       isLike: false,
      //       like: --this.data.like
      //     })
      //   })
      // } else {
      //   ActLike.create(data).then(res => {
      //     this.setData({
      //       isLike: true,
      //       like: ++this.data.like
      //     })
      //   })
      // }
    } else {
      this.noCard()
    }

  },
  goHome() {
    wx.switchTab({
      url: '/pages/cardPage/cardPage',
    })
  },
  saveImage() {
    var that = this
    console.log(11111111111)
    // this.getImage()
    const file = wx.getFileSystemManager();

    if (!this.data.shareImage) {
      wx.showToast({
        title: '名片二维码不存在',
        icon: 'none'
      })
      return
    }

    file.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/activity.png',
      data: this.data.shareImage.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/activity.png',
          success: function(res) {
            wx.showToast({
              title: '保存成功',
            })
            that.setData({
              fullMask: false,
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
    //   filePath: tempFilePath,
    //   success:res=>{
    //     wx.showToast({
    //       title: '保存成功',
    //       icon:'success',
    //       duration:2000,
    //     })
    //     setTimeOut(()=>{
    //       this.setData({
    //         fullMask:false,
    //       })
    //     })
    //   }
    // })
  },
  onShareAppMessage(options) {
    // let activity = this.data.activity
    // console.log(options)
    // console.log(activity.ActivityId)
    // return{
    //   title: `【${activity.ActivitySite}】${activity.ActivityName}` ,
    //   imageUrl: formatAvatar(activity.ActivityIcon),
    //   path: '/pages/activities/activityDetail?id=' + activity.ActivityId,
    // }
  },
  //立即报名
  enter(e) {
    if (!this.data.card) {
      this.noCard()
    } else {
      const parms = {
        // identity: this.data.activity.identity,
        activity_id: this.data.activity.id
      }
      const obj = {

      }
      console.log(parms)
      CheckApply.create(parms).then(res => {
        if (res.result == 0) {
          this.collectFormID(e.detail.formId)
          console.log(res)
          obj.activity = res.data.activity
          obj.card = res.data.card
          if (obj.activity.sign_qbcode) {
            obj.activity.sign_qbcode = ""
          }
          console.log('this.data.activity.id', this.data.activity.id)
          wx.navigateTo({
            url: 'enter?id='+this.data.activity.id,
          })
          console.log('obj', obj)
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      })
      // Apply.get(`${app.globalData.openid}/${activity.ActivityId}`).then(res=>{
      // debug.log(res)
      // let obj = Object.assign(activity,{ActivityDetails:''})
      // delete obj.InitiatorName


    }
  },
  //取消报名
  canclEnter() {
    if (!this.data.card) {
      this.noCard()
    } else {
      const parms = {
        activity_id: this.data.activity.id
      }
      CancelApply.create(parms).then(res => {
        console.log("res", res)
        if (res.result == 0) {
          wx.showToast({
            title: '取消成功',
            duration: 2000
          })
          this.getActivity()
        } else {
          wx.showToast({
            title: "取消失败",
            icon: 'none'
          })
        }
      })
    }


  },
  gotoComment(e) {
    if (this.data.card) {
      if (e.detail.formId) {
        this.collectFormID(e.detail.formId)

      }
      wx.navigateTo({
        url: '../questions/comment?type=activity&id=' + this.data.activity.id,
      })
    } else {
      this.noCard()
    }

  },
  gotoPhoto() {
    wx.navigateTo({
      url: 'photos?id=' + this.data.activityId
    })
  },
  mask() {
    return
  },
  previewImage(e) {

    const {
      index
    } = e.currentTarget.dataset
    let array = activity.DescImages
    let imageArray = array.map(item => {
      return app.globalData.uploadUrl + item
    })
    console.log(index, imageArray)
    wx.previewImage({
      urls: imageArray,
      current: index
    })

  }
})