const app = getApp();
const data = require('../../mock/index.js')
const debug = require('../../utils/debug.js')
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')
const { Apply, CheckApply, ActAddApply } = require('../../utils/Class.js')
let activity = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    activity: {},
    num: 1,
    position: '参与者',
    name:'',
    description:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // activity = data.activityDetail
    // this.setData({
    //   // activity:data.activityDetail,
    //   total: activity.ActivityPrice
    // })
    console.log('ioptiId',options.id)
    activity = null;
    // activity =options.activityDetail;

    this.getEnterInfo(options.id);
    // activity = JSON.parse(options.activity)
    // this.setData({
    //   activity: activity.activity,
    //   userInfo: activity.card
    // })


    // this.setData({ userInfo: app.globalData.userInfo, activity: activity, total:          activity.ActivityPrice.toFixed(2),phone:app.globalData.card.BusTel})
  },

//获取enter页面数据
getEnterInfo(id){
  const parms = {
    showLoading: true,

    // identity: this.data.activity.identity,
    activity_id: id
  }
  CheckApply.create(parms).then(res => {
    if (res.result == 0) {
        console.log('res',res)
        this.setData({
          activity: res.data.activity,
          userInfo: res.data.card
        })
    }
    
    })
},

  choosePosition() {
    let timestamp = (new Date()).getTime() / 1000
    // let day = util.selectDay(timestamp, this.data.activity.ActivityATime)

    let array = ['参与者', '讲师', '赞助商']
    if (this.data.activity.day <= 2) {
      array = ['参与者']
    }
    wx.showActionSheet({
      itemList: array,
      success: res => {
        this.setData({
          position: array[res.tapIndex]
        })
      }
    })

  },
  handleChange1({ detail }) {
    this.setData({
      num: detail.value,
      total: (detail.value * activity.ActivityPrice).toFixed(2)
    })
  },
  changeNum(e) {
    const { id } = e.currentTarget.dataset;
    let { num } = this.data;
    num = Number(num)
    if (id === 'reduce') {
      if (num > 1) {
        num = num - 1
        this.setData({ num: num, total: (num * activity.ActivityPrice).toFixed(2) })
      }
    } else {
      if (num < 99) {
        num = num + 1
        this.setData({ num: num, total: (num * activity.ActivityPrice).toFixed(2) })
      } else if (num === 99) {
        wx.showToast({
          icon: 'none',
          title: '最大数量为99',
        })
      }
    }
  },
  getNum(e) {
    debug.log(e)
    let num = e.detail.value
    if (num > 99) {
      num = 99
      wx.showToast({
        icon: 'none',
        title: '最大数量为99',
      })
    }
    this.setData({ total: (num * activity.ActivityPrice).toFixed(2), num: num })

  },
  getnameText(e){
    this.setData({
      name: e.detail.value
    })
  },
  getText(e) {
    this.setData({
      description: e.detail.value
    })
  },
  getPhoneText(e) {
      this.setData({
        phone:e.detail.value
      })
  },
  submit(e) {
    // debug.log(e)
    // const formId = e.detail.formId
    const { name, phone, total, description } = e.detail.value
    // const changeContent = {
    //   description: description,
    //   phone: phone
    // }
    // const order={
    //   num:this.data.num,
    //   total:this.data.total,
    //   name:name,
    //   phone:phone,
    // }
    if (phone !== '' && name !== '') {
      if (this.data.position === '参与者') {
        wx.navigateTo({
          url: 'confirm?phone=' + phone + '&name=' + name + '&role=' + 1 + "&id=" + this.data.activity.id
        })
        //   http.get(`/act/apply/${app.globalData.openid}/${activity.ActivityId}`).then(res => {
        //     debug.log(res)
        //     // if (res.data.status){
        //       wx.navigateTo({
        //         url: 'confirm?order=' + JSON.stringify(order) + '&activity=' + JSON.stringify(activity) + '&formId=' + formId ,
        //       })
        //     // }
        //   }) 
        // }else{
        //   const data = {
        //     "ActivityId": activity.ActivityId,
        //     "OpenId":app.globalData.openid,
        //     "ApplyName": name ,
        //     "ApplyTel": phone,
        //     "Role":this.data.position==='讲师'?1:2,
        //     "Introduce": description,
        //     "form_id": formId
        //   }
        //   wx.navigateTo({
        //     url: 'confirm?order=' + JSON.stringify(data) + '&activity=' + JSON.stringify(activity) + '&type=role',
        //   })

      } else if (this.data.position === '讲师'){
        wx.navigateTo({
          url: 'confirm?userinfo=' + JSON.stringify(this.data.userInfo) + '&activity=' + JSON.stringify(this.data.activity) + '&phone=' + phone + '&name=' + name + '&role=' + 2 + "&id=" + this.data.activity.id
        })

      } else if (this.data.position === '赞助商'){
        wx.navigateTo({
          url: 'confirm?userinfo=' + JSON.stringify(this.data.userInfo) + '&activity=' + JSON.stringify(this.data.activity) + '&phone=' + phone + '&name=' + name + '&description=' + JSON.stringify(this.data.description) + '&role=' + 3 + "&id=" + this.data.activity.id
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入必填项',
        showCancel: false,
        confirmColor: '#4c89fb'
      })
    }

  }
})