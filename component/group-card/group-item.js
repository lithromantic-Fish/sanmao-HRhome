// component/group-card/group-item.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
    card:{
      type:Object,
      value:{}
    },
    call:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    makePhone(){
      wx.makePhoneCall({
        phoneNumber:this.data.card.mobile,
      })
    },
    gotoDetail(){
      let {
        card_id,
        id
      } = this.data.card
      let _id = card_id || id
      if (!_id) return
      wx.navigateTo({
        url: '/pages/cards/cardDetail?card_id=' + _id,
      })
    }
  }
})
