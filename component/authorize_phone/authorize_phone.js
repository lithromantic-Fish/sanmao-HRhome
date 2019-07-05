let util = require('../../utils/util_wenda');
let config = require('../../config');

// 授权弹窗组件
const  app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  properties: {

  },


  data: {

  },

  methods: {

    //拉起手机授权
    _getPhoneNumber: function (res) {
      console.log(res.detail.encryptedData)
      console.log(res.detail.iv)
      let data = res.detail
      if (data.encryptedData && data.iv) {
        this._confirmEvent(data)
      } else {
          wx.showToast({
          title: '拒绝后你将无法正常使用该应用',
          icon: 'none'
        })
        // util.gotoPage({
        //   url: '/pages/login/login'
        // })
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
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          console.log("session未过期")

          util.request({
            url: config.apiUrl + '/hr/special/wxapp/autoRegister',
            data: data,
            autoHideLoading: false,

            method: "POST",
            withSessionKey: true
          }).then(res => {

            if (res.result == 0) {
              util._setStorageSync('isLogin', 1)
              self.triggerEvent('getPhoneInfo', {
                isLogin: true
              })
              //授权后重新获取详情页数据
              // this.getCommentList();
              // this.getIndexData();
              // util.runFn(self.getInitData)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }

          })
        },
        fail() {
          console.log("session过期")

          util.updateSessionKeyApi().then(res=>{
            this._confirmEvent()
          })
          // session_key 已经失效，需要重新执行登录流程
          // wx.login() //重新登录
        }
      })
      // console.info('opts', opts)

    },

    onGotUserInfo(e) {//获取用户信息
    console.log(e)
      // let userInfo = e.detail.userInfo;
      // wx.setStorageSync('userInfo', userInfo)
      // app.globalData.userInfo = userInfo
      // console.log('e',e)
      // this.triggerEvent('getInfo', { userInfo })
      // if (e.detail.errMsg == "getUserInfo:fail auth deny"){
      //   wx.showToast({
      //     title: '拒绝后你将无法正常使用该应用',
      //     icon: 'none'
      //   })
      // }else{
      //   this.triggerEvent('getInfo', { userInfo })
      // }
    },
  }
})