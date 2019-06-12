const {
  DeleteCard,
  Recommend
} = require('../../utils/Class')
const app = getApp()
const eventBus = require('../../utils/eventbus')

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    card: {
      type: Object,
      value: null
    },
    mine: {
      type: Boolean,
      value: false
    },
    iscall: {
      type: Boolean,
      value: false
    }
  },

  data: {


  },
  methods: {
    preImage() {
      let avatar = this.data.card.photo
      const fdStart = avatar.indexOf("https://wx.qlogo.cn/");
      const start = avatar.indexOf("wxfile://");
      const start2 = avatar.indexOf('http://tmp/')
      if (avatar) {
        if (fdStart === 0 || start === 0 || start2 === 0) {
          avatar = avatar
        } else {
          avatar = avatar
        }
      } else {
        avatar = 'https://static.hrloo.com/hrloo56/hrhomeminiapp/img/default.jpg'
      }
      wx.previewImage({
        urls: [avatar],
      })
    },
    gotoMessage() {
      wx.navigateTo({
        url: '/pages/account/message',
      })
    },
    tapMenu(e) {
      console.log(e)
      let self = this
      if (e.detail.menu.id == 5) {
        wx.showModal({
          title: '提示',
          content: '是否删除该名片',
          confirmColor: '#4c89fb',
          success: res => {
            if (res.confirm) {
              let prams = {
                card_id: self.data.card.id
              }
              DeleteCard.find(prams).then(res => {
                wx.showToast({
                  title: '删除成功',
                  duration: 2000,
                  icon: 'success'
                })
                eventBus.emit('delete')
                setTimeout(() => {
                  wx.navigateBack()
                }, 2000);
              })
              
              // const id = app.globalData.openid + '/' + this.data.card.BusId
              // DeleteCards.get(id).then(res => {
              //   wx.showToast({
              //     title: '删除成功',
              //     duration: 2000,
              //     icon: 'success'
              //   })
              //   eventBus.emit('delete')
              //   setTimeout(() => {
              //     wx.navigateBack()
              //   }, 2000);
              // })
            }
          }
        })
      }
      //  else if (e.detail.menu.name === '推荐该名片') {
      //   wx.showModal({
      //     title: '提示',
      //     content: '是否推荐该名片',
      //     confirmColor: '#4c89fb',
      //     success: res => {
      //       if (res.confirm) {

      //         // let id = app.globalData.openid + '/' + this.data.card.BusId
      //         // Recommend.get(id).then(res => {
      //         //   console.log(res)
      //         //   wx.showToast({
      //         //     title: '推荐成功',
      //         //     icon: 'success',
      //         //     duration: 2000
      //         //   })
      //         // })
      //       }
      //     }
      //   })
      // }
    },
    //给对方打电话
    call() {
      wx.makePhoneCall({
        phoneNumber: this.data.card.mobile,
      })
    }
  }
})