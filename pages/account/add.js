const {
  GroupList,

  Group,
  AddGroup,
  ContactAddGroupList,
  InGroup
} = require('../../utils/Class.js')
const app = getApp()


let groups = []
let id
let self = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups: [],
    current: '',
    showModal: false,
    groupName: '暂无分组'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // id = options.id
    console.info(options)
    // let Id = app.globalData.openid + '/' + id
    // InGroup.get(Id).then(res => {
    //   if (res.list) {
    //     this.setData({
    //       groupName: res.list.GrouName
    //     })
    //   }
    // })
    this.getGroups()
  },
  hidden() {
    this.setData({
      showModal: !this.data.showModal
    })
  },
  // save(e) {
  //   // console.log(e.detail.groupName)
  //   const data = {
  //     OpenId: app.globalData.openid,
  //     GrouName: e.detail.groupName,
  //   }
  //   // if(!choosedGroup){
  //   AddGroup.create(data).then(res => {
  //     // debug.log(res)
  //     wx.showToast({
  //       title: '创建成功',
  //       icon: 'success',
  //       duration: 1000
  //     })
  //     groups = []
  //     this.getGroups()
  //     this.setData({
  //       showModal: false
  //     })
  //   })
  // },
  changeRadio({
    detail = {}
  }) {
    console.log(detail)
    this.setData({
      current: detail.value
    });
  },
  getGroups() {
    GroupList.find().then(res => {
      // debug.log('group===', res)
      if (res && res.result === 0) {
        let {data} = res.data
        this.setData({
          groups: data
        })
      }
      // if (res.list && res.list.length) {
      //   groups = res.list
      //   this.setData({
      //     groups
      //   })
      // }
    })
  },
  // confirm() {
  //   if (!this.data.current) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '您还没有选择分组',
  //       confirmColor: "#4c89fb",
  //       showCancel: false
  //     })
  //   } else {
  //     let obj = {
  //       data: [{
  //         "GrouId": this.data.current,
  //         "BusId": id,
  //         "OpenId": app.globalData.openid
  //       }]
  //     }
  //     ContactAddGroupList.create(obj).then(res => {
  //       console.log(res)
  //       wx.showToast({
  //         title: '添加成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //       setTimeout(() => {
  //         wx.navigateBack()
  //       }, 2000);
  //     })
  //   }
  // }

})