//名片列表组件
// const http = require('../../utils/http.js')

const app = getApp()
// const debug = require('../../utils/debug.js')
const wxNotice = require('../../vendors/WxNotificationCenter')
const {
  CardAgree,
  SaveFormID
} = require('../../utils/Class.js')

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    image: {
      type: String,
      value: null,
    },
    title: {
      type: String,
      value: null
    },
    description: {
      type: String,
      value: null
    },
    role: {
      type: String,
      value: null
    },
    pathUrl: {
      type: String,
      value: null
    },
    new: {
      type: Boolean,
      value: false
    },
    status: {
      type: Number,
      value: null
    },
    bus: {
      type: Number,
      value: null
    },
    price: {
      type: Number,
      value: null
    },
    answer: {
      type: Boolean,
      value: false
    },
    card: {
      type: Object,
      value: null
    },
    home: {
      type: Boolean,
      value: false
    },
    sign: {
      type: Boolean,
      value: false
    },
    applyId: {
      type: String,
      value: ''
    },
    actId: {
      type: String,
      value: ''
    },
    openid: {
      type: String,
      value: ''
    },
    roleValue: {
      type: Number,
      value: 0
    },
    index: { //item 下标
      type: Number,
      value: 0
    },
    mobile:{
      type:Number,
      value:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tap: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      console.log('e',e)
      console.log('this.data', this.data.applyId)
     //如果有申请id，就是申请查看的详情
      if (this.data.applyId){
        return
      }else{

      SaveFormID.find({ formId: e.detail.formId}); //收集formid

      this.setData({
        tap: true
      })


      let myOpenid = wx.getStorageSync('userInfo').openid
      let itemOpenid = this.data.openid
      if (!this.data.new && myOpenid && itemOpenid && myOpenid == itemOpenid) {
        wx.navigateTo({
          url: '/pages/account/myCardDetail',
        })
        return
      }

      if (!this.data.new) {
        wx.navigateTo({
          url: this.data.pathUrl,
        })
      }
      }

    },
    //收集formId
    collectFormId(e) {
      console.log('e', e)
      console.log('this.data', this.data.applyId)
      //如果有申请id，就是申请查看的详情
      if (this.data.applyId) {
        return
      } else {

        SaveFormID.find({ formId: e.detail.formId }); //收集formid

        this.setData({
          tap: true
        })


        let myOpenid = wx.getStorageSync('userInfo').openid
        let itemOpenid = this.data.openid
        if (!this.data.new && myOpenid && itemOpenid && myOpenid == itemOpenid) {
          wx.navigateTo({
            url: '/pages/account/myCardDetail',
          })
          return
        }

        if (!this.data.new) {
          wx.navigateTo({
            url: this.data.pathUrl,
          })
        }
      }

    },

    switchCard() {
      const card = this.data.card
      const myCard = app.globalData.card
      if (!app.globalData.card) {
        wx.showModal({
          title: '提示',
          content: '您还没有名片是否立刻去制作',
          confirmColor: '#4c89fb',
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/cards/makeCard',
              })
            }
          }
        })
      } else {
        if (card.id === myCard.id) {
          wx.showToast({
            title: '不可以交换自己的名片',
            icon: 'none',
            duration: 1000,
          })
        } else {
          wx.showToast({
            title: '申请成功 请等待对方确认',
            icon: 'none',
            duration: 1000,
          })
          wxNotice.postNotificationName('new')
        }
      }
    },
    //申请名片交互 同意
    aggress(e) {

      let {
        formId,
        target
      } = e.detail

      const prams = {
        formId
      }
      SaveFormID.find(prams); //收集formid

      let {
        id
      } = target.dataset

      let {
        card,
        index
      } = this.data

      let self = this

      CardAgree.find({
        id: id
      }).then(res => {
        if (res && res.result === 0) {
          //返回当前被点击的item下标 这个下标也是组件中带过来的
          self.triggerEvent('aggressCard', {
            index: index,
            id: id
          })

          wx.showToast({
            title: '已收入该名片',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    },
    gotoDetail(e) {
      // console.log(11111111)
      console.log('111111111',e)

      wx.navigateTo({
        url: '/pages/activities/signDetail?ApplyId=' + this.data.applyId,
      })
      // wx.navigateTo({
      //   url: '/pages/activities/signDetail?ApplyId=' + this.data.applyId + '&ActivityId=' + this.data.actId + '&Openid=' + this.data.openid
      // })
    }
  }

})