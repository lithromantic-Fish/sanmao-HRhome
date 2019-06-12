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
    onGotUserInfo(e) {//获取用户信息
    console.log(e)
      let userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', userInfo)
      app.globalData.userInfo = userInfo
      // this.triggerEvent('getInfo', { userInfo })
      if (e.detail.errMsg == "getUserInfo:fail auth deny"){
        wx.showToast({
          title: '拒绝后你将无法正常使用该应用',
          icon: 'none'
        })
      }else{
        this.triggerEvent('getInfo', { userInfo })
      }
    },
  }
})