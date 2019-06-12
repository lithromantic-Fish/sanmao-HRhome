// const {
//   $Message
// } = require('../../dist/base/index');
const {
  GroupList, //分组列表
  CreateGroup, //创建分组
  EditGroup, //编辑分组
  DelGroup, //删除分组

  Group,
  DeleteGroup
} = require('../../utils/Class.js')

const app = getApp()
let groups = []
let choosedGroup

let self = {}
let myCard = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
    toggle2: false,
    showModal: false,
    groups,
    actions: [{
        name: '喜欢',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'like',
        background: '#ed3f14'
      },
      {
        name: '返回',
        width: 100,
        color: '#80848f',
        fontsize: '20',
        icon: 'undo'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this

    // self.getGroups()
    // choosedGroup = null
    myCard = wx.getStorageSync('card') || app.globalData.card
  },

  onShow(){
    self = this

    self.getGroups()
    choosedGroup = null
  },
  //获取页面默认数据
  getGroups() {

    GroupList.find().then(res => {
      if (res && res.result === 0) {
        let {
          data
        } = res.data
        this.setData({
          groups: data
        })
      }
    })
  },

  //是否创建名片 没有创建提示区创建
  isCreateCard() {
    if (!myCard) {
      wx.showModal({
        title: '提示',
        content: '您还没有名片，是否立即前往',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/cards/makeCard',
            })
          }
        }
      })
    }
  },

  hidden() {

    if (!myCard) {
      self.isCreateCard()
      return
    }

    choosedGroup = null
    this.setData({
      showModal: !this.data.showModal
    })
  },
  _editGroup(e) {
    let {
      item
    } = e.currentTarget.dataset
    choosedGroup = item
    // console.info('item', item)
    this.setData({
      groupName: item.name,
      showModal: true
    })
  },
  //保存
  save(e) {
    // console.log('save-e.detail',e.detail) 

    let {
      groupName
    } = e.detail


    
    if (!choosedGroup) {
      //创建分组
      CreateGroup.find({ name: groupName}).then(res => {
        if (res && res.result === 0) {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1000
          })
          this.getGroups()
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
        this.setData({
          showModal: false
        })
      })
    } else {
      // 编辑分组
      let prams = {
        name: e.detail.groupName,
        group_id: choosedGroup.id
      }
      //console.info('编辑分组', data)
     
      EditGroup.create(prams).then(res => {
        if (res && res.result ===0) {
          choosedGroup = null
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          this.getGroups()
          this.setData({
            showModal: false,
            toggle: true
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }

  },
  _deleteGroup(e) {

    wx.showModal({
      title: '提示',
      content: '是否删除该分组',
      confirmColor: '#4c89fb',
      success: res => {
        if (res.confirm) {
          let {
            id
          } = e.currentTarget.dataset.item
          DelGroup.find({group_id:id}).then(res => {
            if (res && res.result === 0) {
              // debug.log('delete=', res)
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              this.getGroups()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })

            }
          })
        }
      }
    })
  },
  gotoGroupDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: 'groupDetail?id=' + item.id,
    })
  },

})