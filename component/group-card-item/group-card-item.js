const app = getApp()

// const debug = require('../../utils/debug')
const {
  DelGroupPeople
} = require('../../utils/Class')

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    card: {
      type: Object,
      value: {}
    },
    index:{
      type: Number,
      value: ''
    }
  },
  pageLifetimes: {
    show() {
      this.setData({
        toggle: true
      })
    }
  },

  data: {

  },

  methods: {
    delete(e) {
      let self = this
      wx.showModal({
        title: '提示',
        content: '是否将该联系人从分组里删除',
        confirmColor: '#4c89fb',
        success: res => {
          if (res.confirm) {
            // const id = app.globalData.openid + '/' + this.data.card.BusId
            let { member_id } = self.data.card
            DelGroupPeople.find({ member_id: member_id }).then(res => {
              console.log(res)
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              this.triggerEvent("deletePeople", this.data.card)
            })
          }
        }
      })
    }
  }
})