const app = getApp();
const data = require('../../mock/index.js')
const debug = require('../../utils/debug.js')
const {
  Order,
  Orders,
  ActAddApply,
  CheckApply,
  Apply
} = require('../../utils/Class.js')
let config = require('../../config');
const util_wenda = require('../../utils/util_wenda');
const http = require('../../utils/http.js')
let activity = null;
let order = null;
let formId1 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    userInfo: {},
    order: {},
    role: '',
    intro: '',
    phone:'',
    name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if(options.id){
      this.getEnterInfo(options.id);
    }
    if (options.description != 'undefined' && options.description){
          this.setData({
            intro: JSON.parse(options.description),//备注
            // activity: JSON.parse(options.activity),
            // userInfo: JSON.parse(options.userinfo),
            name: options.name,
            phone:options.phone,
            role: options.role
          })
        }else{
          this.setData({
            // activity: JSON.parse(options.activity),
            // userInfo: JSON.parse(options.userinfo),
            name: options.name,
            phone: options.phone,
            role: options.role
          })
        }

    // this.setData({
    //   activity: data.activityDetail
    // })
    // activity = null
    // order=null
    // formId1 = null

    // if(options.orderId){
    //   formId1 = options.formId
    //   Orders.get(options.orderId).then(res=>{
    //     debug.log(res)
    //    order={
    //       phone: res.list.ApplyTel,
    //       num:res.list.Number,
    //      total: res.list.OrderPrice,
    //      name: res.list.ApplyName
    //     }
    //     activity = res.list
    //     this.setData({ userInfo: app.globalData.userInfo, order: order, activity: activity, total: order.total, orderId: options.orderId})
    //   })
    // }
    // else{
    //   if(options.type==='role'){
    //     order = JSON.parse(options.order)
    //     activity = JSON.parse(options.activity)
    //     this.setData({ userInfo: app.globalData.userInfo, activity: activity, order: order,type:'role' })
    //   }else{
    //     formId1 = options.formId
    //     // activity = data.activityDetail;
    //     activity = JSON.parse(options.activity)
    //     order = JSON.parse(options.order)

    //     this.setData({ userInfo: app.globalData.userInfo, activity: activity, order: order,total:order.total })
    //   }
    // }
  },
  //获取confirm页面数据
  getEnterInfo(id) {
    const parms = {
      showLoading: true,

      // identity: this.data.activity.identity,
      activity_id: id
    }
    // CheckApply.create(parms).then(res => {
    util_wenda.request({
      url: config.hrlooUrl + CheckApply,
      data: data,
      autoHideLoading: false,
      data: parms,
      method: "POST",
      withSessionKey: true
    }, this.getEnterInfo, id).then(res => {
      if (res.result == 0) {
        console.log('res', res)
        this.setData({
          activity: res.data.activity,
          // userInfo: res.data.card
        })
      }

    })
  },
  //支付人气值
  gotoPay(e) {

    let activity = e.currentTarget.dataset.activity
    let userInfo = e.currentTarget.dataset.userinfo

    const parms = {
      identity: this.data.role,
      username: this.data.name,
      mobile: this.data.phone,
      activity_id: activity.id,
      intro: ''
    }
    console.log(this.data.intro)
    if (this.data.intro) {
      showLoading: true,

      parms.intro = this.data.intro
    }
    Apply.create(parms).then(res => {
      if (res.result == 0) {
        if(this.data.role==1){

        wx.showToast({
          title: '支付成功',
          duration: 2000,
        })
        }
        else{
          wx.showToast({
            title: '提交成功',
            duration:2000
          })
        }
        setTimeout(() => {
          wx.navigateTo({
            url: '../account/myActivities'
          })
        },2000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

    // const formId2 = e.detail.formId
    // if (this.data.type === 'role') {
    //   order.form_id = e.detail.formId
    //   ActAddApply.create(this.data.order).then(res => {
    //     debug.log('报名讲师、赞助商==', res)
    //     wx.showToast({
    //       title: '提交成功',
    //       duration: 2000,
    //     })
    //     setTimeout(() => {
    //       wx.reLaunch({
    //         url: '../account/myActivities',
    //       })
    //     }, 2000)

    //     //   wx.navigateTo({
    //     //     url: 'confirm?order=' + JSON.stringify(order) + '&activity=' + JSON.stringify(activity) + '&formId=' + formId,
    //     // })
    //   })
    // } else {
    //   if (this.data.orderId) {
    //     this.pay(this.data.orderId, formId2)
    //   } else {
    //     const data = {
    //       BusName: order.name,
    //       BusTel: order.phone,
    //       ActivityId: activity.ActivityId,
    //       Number: order.num,
    //       OrderPrice: order.total,
    //       OpenId: app.globalData.openid
    //     }
    //     Order.create(data).then(res => {
    //       debug.log('order----', res)
    //       this.pay(res, formId2)
    //     })
    //   }
    // }
  },
  pay(id, formId2) {
    http.post(`/act/payment/${app.globalData.openid}/${id}`, {
      formId1,
      formId2
    }).then(_res => {
      debug.log(_res)
      wx.showToast({
        title: '支付成功',
        duration: 2000,
      })

      setTimeout(() => {
        wx.reLaunch({
          url: '../account/myActivities',
        })
      }, 2000)
    })
  }

})