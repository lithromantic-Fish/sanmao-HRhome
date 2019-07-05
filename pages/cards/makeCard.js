const app = getApp()
const moment = require('../../vendors/moment.min')
// const debug = require('../../utils/debug')
const eventBus = require('../../utils/eventbus')
const login = require('../../utils/login.js')
const upload = require('../../utils/upload.js')
const {
  Card,
  MyCard,
  GetMobile,
  SaveFormID
} = require('../../utils/Class.js')

// const http = require('../../utils/http.js')
const util = require('../../utils/util')
const PY = require('../../utils/pinyin.js')
// const WxNotice = require('../../vendors/WxNotificationCenter.js')
const genderArr = ['男', '女']

const professions = [] //后台获取的 行业列表
let userInfo = null //用户信息
let firstMoment = null;
let city = null; //城市
let card = null; //名片
let code = null; //
let tempFilePaths = null;
let type = null
let loading = false

function findIndex(item, array) {
  let index = array.findIndex(it => {
    return item === it
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderArr: genderArr,
    professions: professions, //后台配置的行业列表信息
    region: [],
    regionText: '请选择工作城市',
    professionText: '请选择行业',
    bind: false,
    mobile: null,
    cityData:[],
    workData:null,
    // code: null,
    // text: '点我验证',
    status: 2, //1：不公开；2：公开
    confirm: null,
    // BusOvert: true
  },


  onLoad: function(options) {
    eventBus.on('changeValue', this.getChangeValue) //获取上传资质页面的 图片数据

    card = null
    userInfo = null
    firstMoment = null;
    city = null;
    code = null;
    loading = false;
    type = options.type
    this.getMyCard()
  },
  // 公司名称  只能输入中文 数字 字母
  bindKeyInput(e) {
    this.setData({
      company: e.detail.value.replace(/[^\u4E00-\u9FA5A-Za-z0-9]/g, '')
    })
  },
  // 根据行业id/name获取名字/id
  getIndustryResult(pram) {
    let self = this
    let {
      professions
    } = self.data
    let _type= typeof (pram)
    if (professions.length) {
      for (let i = 0; i < professions.length; i++) {
        if (_type == 'number' && professions[i].id == pram) {
          return professions[i].name
        } else if (_type == 'string' && professions[i].name == pram) {
          return professions[i].id
        }
      }
      return null
    }
  },
  //获取名片信息
  getMyCard() {
    let self = this
    MyCard.find().then(_res => {
      if (_res.result==0){

      let {
        data,
        industry
      } = _res.data
      self.setData({
        'professions': industry,
      })
      if (data) {
        //有名片
        city = data.city
        self.setData({
          'userInfo': wx.getStorageSync('userInfo'),
          "photo": data.photo,
          "nickname": data.nickname,
          'mobile': data.mobile,
          'company': data.company,
          'email': data.email,
          'duty': data.duty,
          'gender': data.gender == 2 ? '1' : '0',
          'industry': data.industry,
          'professionText': self.getIndustryResult(parseInt(data.industry)),
          'regionText': data.city,
          'city': data.city,
          'status': data.status
        })
      } else {
        firstMoment = null;
        city = null;
        let mobile = null;
        // tempFilePaths = null
        // debug.log(firstMoment)
        userInfo = wx.getStorageSync('userInfo') || null
        mobile = wx.getStorageSync('mobile') || null
        if (userInfo) {
          // console.info('app.globalData.userInfo', app.globalData.userInfo)
          this.setData({
            userInfo: userInfo,
            gender: userInfo.gender === 2 ? '1' : '0',
            mobile: mobile,
            // userInfo: app.globalData.userInfo,
            photo: userInfo.avatarUrl,
            nickname: userInfo.nickName
          })
        }
      }

    }else if(_res.result==999){
        self.updataApiCard()
    }
   })

  },
  updataApiCard(){
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getMyCard()
        })

      }
    })
  },
  // 获取微信的信息
  // getInfo(e) {
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo
  //   })
  //   wx.setStorageSync('userInfo', e.detail.userInfo)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: userInfo,
  //     avatarUrl: userInfo.avatarUrl,
  //     nickName: userInfo.nickName,
  //     gender: userInfo.gender === 2 ? '1' : '0'
  //   })
  //   wx.login({
  //     success: res => {
  //       login.login(res.code, app.globalData.userInfo).then(res => {
  //         debug.log(res)
  //       })
  //     }
  //   })
  // },
  cityChange(e) { //改变城市
    // debug.log(e)
    // console.info(e)
    city = e.detail.value
  },
  professionChange(e) { //改变选择职业
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let self = this
    this.setData({
      professionsIndex: e.detail.value,
      professionText: self.data.professions[e.detail.value].name,
      workData: e.detail.value
    })
  },
  genderChange(e) { //改变性别
    const {
      genderArr
    } = this.data
    this.setData({
      gender: e.detail.value
    })
  },
  // getCode() { //点击获取验证码
  //   this.setData({
  //     bind: true
  //   })
  //   if (!firstMoment) {
  //     this.sendCode()
  //   } else {
  //     let current = new Date();
  //     let currentMoment = current.getTime();
  //     let duration = currentMoment - firstMoment
  //     if (duration < 60000) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '操作频繁，请' + ((60000 - duration) / 1000).toFixed(0) + 's后再试',
  //         showCancel: false
  //       })
  //     } else {
  //       this.sendCode()
  //     }
  //   }
  // },
  // sendCode() {
  //   let now = new Date();
  //   firstMoment = now.getTime();
  //   wx.showToast({
  //     title: '已发送',
  //     icon: 'none',
  //     duration: 1000
  //   })
  //   http.post(`/sendSms/${this.data.mobile}`).then(res => {
  //     debug.log(res.data.code)
  //     code = res.data.code
  //   })
  // },

  save(e) { //保存
  console.log('e',e)
    // SaveFormID.find({ formId : e.detail.formId})

    if (loading) {
      return
    }

    let empty = [];
    const Name = {
      nickname: '姓名',
      mobile: '电话',
      company: '公司',
      email: '邮箱',
      duty: '职位',
      industry: '行业',
      city: '城市',
    }

    let {
      photo,
      nickname,
      mobile,
      gender,
      company,
      duty,
      industry,
      email,
     cityData,
     workData,
      status
    } = e.detail.value

    let list = e.detail.value
    list = Object.assign(list, {
      city: city
    })
    // for (let i in list) {
    //   if (i != 'status') {
    //     if (!list[i]) {
    //       empty.push(Name[i])
    //     }
    //     if (list[i] == '请选择行业') {
    //       empty.push('行业')
    //     }
    //   }
    // }
    console.info('list', list)
    console.info(
      'photo-'+photo,
      'nickname-' + nickname,
      'mobile-' + mobile,
      'gender-' + gender,
      'company-' + company,
      'duty-' + duty,
      'industry-' + industry,
      'email-' + email,
      'status-' + status)

    const p = /[0-9]/
    const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    const b = p.test(nickname); //true
    const Enchar = regEn.test(nickname)
    const Cnchar = regCn.test(nickname)
    const emoji = util.isEmojiCharacter(nickname)
    if (b || Enchar || Cnchar || emoji) {
      wx.showModal({
        title: '提示',
        content: '姓名仅支持中英文',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }

    if (!mobile || isNaN(mobile) || mobile.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入或点击快速获取手机号码',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }

    if (mobile.length == 11) {
      var myreg = /^1[34578]\d{9}$/;
      if (!myreg.test(mobile)) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式不对',
          confirmColor: "#4c89fb",
          showCancel: false
        })
        return;
      }
    }
    const re_number = /^\d+$/;
    const re_c = /^[`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-、]+$/;
    const re_cn = /^[`~!@#$%^&*()_+<>?:"{},.\/;'[\]1-9\-、]+$/
    const n = re_number.test(company)
    const c = re_c.test(company)
    const cn = re_cn.test(company)

    // if (n || c || cn || !company) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写公司名称，名称不得全部为标点符号以及全部数字',
    //     confirmColor: "#4c89fb",
    //     showCancel: false
    //   })
    //   return
    // } 
    if (!company) {
      wx.showModal({
        title: '提示',
        content: '请填写公司名称',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }
    // cityData: [],
    //   workData: null,

    if (!this.data.workData && !this.data.professionText){
      wx.showModal({
        title: '提示',
        content: '请填写行业',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }
    if (this.data.cityData.length == 0 && !this.data.regionText) {
      wx.showModal({
        title: '提示',
        content: '请填写工作城市',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }
    const n1 = re_number.test(duty)
    const c1 = re_c.test(duty)
    const cn1 = re_cn.test(duty)
    
    // if (n1 || c1 || cn1 || !duty) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写职位，名称不得全部为标点符号以及全部数字',
    //     confirmColor: "#4c89fb",
    //     showCancel: false
    //   })
    //   return
    // } 
    if (!duty) {
      wx.showModal({
        title: '提示',
        content: '请填写职位',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }
    if (!email){
      wx.showModal({
        title: '提示',
        content: '请填写邮箱',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }

    const re_email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    const emailTest = re_email.test(email)
    if (!emailTest) {
      wx.showModal({
        title: '提示',
        content: '邮箱地址填写不正确',
        confirmColor: "#4c89fb",
        showCancel: false
      })
      return
    }

    // if (empty.length > 0) {
    //   const str = empty.join('、')
    //   wx.showModal({
    //     title: '提示',
    //     content: '抱歉，您的' + str + '需要填写完整',
    //     confirmColor: "#4c89fb",
    //     showCancel: false
    //   })
    //   return
    // }
    
    // if (!this.data.confirm && code) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '手机号验证未通过',
    //     confirmColor: "#4c89fb",
    //     showCancel: false
    //   })
    //   return
    // } else {
      wx.showLoading({
        title: '请稍后',
      })
      loading = true
      let data = {
        nickname: nickname,
        mobile: mobile,
        gender: gender == '女' ? '2' : '1',
        company: company,
        duty: duty,
        email: email,
        city: city,
        industry: industry,
        status: status == true ? 2 : 1
      }

      // if (tempFilePaths) {
      //   upload.upload(this.data.photo).then(res => {
      //     debug.log('photo...ok', res.data)
      //     const icon = JSON.parse(res.data)
      //     data = Object.assign(data, {
      //       photo: icon.filename
      //     })
      //     this.post(data)
      //   })
      //   // TO DO
      // } else {
      data = Object.assign(data, {
        photo: this.data.photo
      })
      this.post(data)
      // }
    // }
  },

  post(data) {
    // console.info('post->',data)
    // if (type === 'put') {
    //   data = Object.assign(data, {
    //     BusId: app.globalData.card.BusId
    //   })
    //   http.put('/bus/hr_business', data).then(res => {
    //     debug.log(res)
    //     app.globalData.card = res.data.list
    //     wx.setStorageSync('card', res.data.list)
    //     wx.showToast({
    //       title: '保存成功',
    //       duration: 2000,
    //     })
    //     WxNotice.postNotificationName('card', res.data.list)
    //     setTimeout(() => {
    //       wx.navigateBack()
    //     }, 2000)
    //   })
    //   wx.hideLoading()
    //   loading = false
    // } else {
    // 修改名片
    let self = this
    let prams = Object.assign(data, {
      showLoading: true,

      'dosubmit': 1,
      'industry': self.getIndustryResult(data.industry)
    })

    MyCard.create(prams).then(res => {
      // debug.log(res)
      if (res && res.result === 0) {
        app.globalData.card = data
        console.log("app.globalData.card", app.globalData.card)
        wx.setStorageSync('card', data)
        wx.showToast({
          title: '保存成功',
          duration: 2000,
        })
        // WxNotice.postNotificationName('card', data)
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
        wx.hideLoading()
        loading = false
      }else if(res.result==999){
        self.updataApiSave(data);
      }
      else {
        wx.hideLoading()
        wx.showToast({
          title: '操作失败，请重试',
          icon:'none',
          duration: 2000,
        })
        loading = false
      }
    })
    // }

  },
  updataApiSave(e){
    const that = this
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          this.post(e)
        })

      }
    })
  },
  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          const userInfo = wx.getStorageSync("userInfo")
          that.setData({
            mobile: userInfo.mobile
          })
        })

      }
    })
  },
  //selectRow的值
  getChangeValue(e){
    console.log(e.detail.value)
    this.setData({
      cityData: e.detail.value
    })
  },
  //上传头像
  changeAvatar() {
    let self = this
    wx.chooseImage({
      count: 1,
      success(res) {
        let tempFilePath = res.tempFilePaths[0]
        wx.showLoading({title:'图片上传中'})
        wx.uploadFile({
          url: app.globalData.url + '/hr/hrhome/hractivity/ajax_upload_image',
          filePath: tempFilePath,
          name: 'imgFile',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          formData: {
            cut: 1,
            hrhome_token: wx.getStorageInfoSync('hrhome_token')
          },
          success(r) {
            // do something
            let {
              data,
              result,
              msg
            } = JSON.parse(r.data)

            if (result === 0 && data ) {
              data.imgUrl && self.setData({
                photo: data.imgUrl
              })
            } else {
              wx.showToast({
                title: msg,
                icon: 'none'
              })
            }
          },
          complete(r){
            wx.hideLoading()
          }
        })
      }
    })
  },
  _getPhoneNumber(e) {
    // debug.log('获取手机号===', e)
    let self = this
    const data = {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
    }
    if (!data.encryptedData||!data.iv)return
    GetMobile.find(data).then(res => {
      if (res && res.result === 0) {
        let {
          data
        } = res.data
        let o = JSON.parse(data)
        self.setData({
          mobile: o.phoneNumber,
        })
        console.log("mobile", self.data.mobile)
        app.globalData.mobile = o.phoneNumber
        wx.setStorageSync('mobile', o.phoneNumber)
      } else if (res.result == 999) {
        self.updataApi()
      }
      // else {
      //   wx.showToast({
      //     title: res.msg,
      //     icon: 'none'
      //   })
      // }

    })
  },
  // confirm(e) {
  //   if (this.data.confirm !== 'confirm') {
  //     let confirmCode = this.data.code
  //     debug.log('code', confirmCode)
  //     if (confirmCode == code) {
  //       this.setData({
  //         confirm: 'confirm',
  //         text: '验证通过'
  //       })
  //     } else {
  //       wx.showToast({
  //         title: '验证码错误',
  //         icon: 'none',
  //         duration: 1000
  //       })
  //       this.setData({
  //         confirm: 'false',
  //         text: '点我重试'
  //       })
  //     }
  //   }
  // },
  getCodeNum(e) {
  
    // debug.log(e.detail.value)
    this.setData({
      code: e.detail.value,
    })
  },
  // 输入手机号码
  getPhone(e) {
    this.setData({
      mobile: e.detail.value
    })
  }
})