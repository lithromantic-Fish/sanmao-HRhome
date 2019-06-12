const {
  GroupListById,
  SaveFormID
} = require('../../utils/Class')
const app = getApp()

let groupId
let self = {}
let loadAll = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    content: '',
    loadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    groupId = options.id
  },

  onShow() {
    self = this
    self.getContacts()
  },

  getContacts() {
    let {
      content
    } = self.data
    GroupListById.find({
      nickname: content,
      group_id: groupId
    }).then(res => {
      if (res && res.result ===0) {
        let {data} = res.data
        self.setData({
          cards: data
        }) 
      }
    })
    // const Id = id + '/' + app.globalData.openid
    // ContactInGroup.get(Id).then(res => {
    //   debug.log('ContactInGroup==', res)
    //   if (res.list && res.list.length > 0) {
    //     cards = res.list
    //     this.setData({
    //       cards
    //     })
    //   } else {
    //     cards = []
    //     this.setData({
    //       cards: []
    //     })
    //     loadAll = true
    //   }
    // })
  },
  //跳转到添加联系人页面 -同时搜集formId
  addContacts(e) {
    let { formId } = e.detail

    SaveFormID.find({ formId: formId })

    wx.navigateTo({
      url: '/pages/account/chooseCards?id=' + groupId,
    })
    
  },
  getText(e) {
    // debug.log(e)
    let { value } = e.detail
    if (e.detail.value) {
      this.setData({
        delete: true,
        content: value
      })
    } else {
      this.setData({
        content: value
      })
    }
  },
  clear() {
    self.setData({
      content: '',
      delete: false
    })
    self.getContacts()
  },
  // searchMt() {
  //   searchList = []
  //   let content = this.data.content
  //   if (content == '') {
  //     searchList = []
  //     this.setData({
  //       search: false,
  //       searchList: searchList
  //     })
  //   } else {
  //     for (let i = 0; i < cards.length; i++) {
  //       let str = cards[i].BusName
  //       if (str.indexOf(content) > -1) {
  //         debug.log(cards[i])
  //         searchList.push(cards[i])
  //       }
  //     }
  //     this.setData({
  //       search: true,
  //       searchList: searchList
  //     })
  //   }
  // },
  delete(e) {
    self.getContacts()
  }
})