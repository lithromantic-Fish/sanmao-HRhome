const {
  NotifyList,
  DelNotify
} = require('../../utils/Class')
const app = getApp()

let self = {}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [], //消息列表
    page: 1, //页码 
    loadAll: false, //

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this

    self.getMessage()
  },
  getMessage() {
    let {
      type,
      page,
      loadAll
    } = self.data

    let prams = {
      type,
      page
    }

    NotifyList.find().then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages_num
        } = res.data

        if (pages_num == 1 || pages_num == page) {
          self.setData({
            loadAll: true
          })
        }
        //第一页
        if (page == 1) {
          self.setData({
            messages: data.data
          })
        } else {
          //分页
          // console.info('fenye', data.data)
          self.setData({
            messages: [...self.data.messages, ...data.data]
          })
        }
      }
    })

  },

  // 点击列表  红点消失
  // handledot(e) {
  //   // console.log(e.currentTarget.dataset.index)
  //   let index = e.currentTarget.dataset.index;
  //   // UpLookSystemt
  //   console.log(this.data.messages)
  //   let id = this.data.messages[index].OpenId
  //   UpLookSystemt.get(id).then(res => {
  //     console.log(res)

  //   })
  //   this.onLoad()
  // },

  //删除消息
  _delete(e) {
    wx.showModal({
      title: '提示',
      content: '是否删除该通知',
      confirmColor: "#4c89fb",
      success: res => {
        if (res.confirm) {
          let {
            id
          } = e.currentTarget.dataset

          DelNotify.find({
            id: id
          }).then(res => {
            let txt = '',
              icon = ''
            if (res && res.result === 0) {
              txt = '删除成功'
              icon = 'success'
              setTimeout(() => {
                self.getMessage()
              }, 1000);
              self.setData({
                toggle: true
              })
            } else {
              txt = '删除失败'
              icon = 'none'
            }
            wx.showToast({
              title: txt,
              icon: icon,
              duration: 2000
            })
          })
        } else {
          self.setData({
            toggle: true
          })
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    self.setData({
      page: 1,
      loadAll: false
    })
    self.getMessage().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  //上拉加载更多
  onReachBottom: function() {
    let {
      page,
      loadAll
    } = self.data
    if (!loadAll) {
      self.setData({
        page: ++page
      })
      self.getMessage()
    }
  }


})