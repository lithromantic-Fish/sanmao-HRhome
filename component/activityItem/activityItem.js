// 活动列表组件
const http = require('../../utils/http.js')
const app = getApp()
const debug = require('../../utils/debug.js')
const moment = require('../../vendors/moment.min.js')
const {
  ActivityDetailData,
} = require('../../utils/Class')
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    isactivity: { //是否为活动
      type: Boolean,
      value: false
    },
    activity: { //活动列表数据
      type: Object,
      value: null
    },
    num: {
      type: Number,
      value: 1
    },
    order: {
      type: Boolean,
      value: false
    },
    lookSign: {
      type: Boolean,
      value: false
    },
    hidePay: {
      type: Boolean,
      value: false
    },
    role: {
      type: Number,
      value: 1
    },
    
    type: { //type 1我参与的  2我发起的  3我收藏的
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    // const t1 = moment(this.data.activity.ActivityATime * 1000)
    // const t3 = moment(this.data.activity.ActivityETime * 1000)
    // const t2 = moment()
    // let status = 0
    // if (t2.isBefore(t1)){
    //   console.log('活动未开始')
    //   status=0
    // } else if(t2.isBetween(t2,t3)){
    //   console.log('活动中')
    //   status = 1
    // }
    // else if (t2.isAfter(t3)) {
    //   console.log('活动结束')
    //   status = 2
    // }
    // this.setData({ status: status })
  },
  methods: {
    gotoDetail(e) {
      // let activeDetailId = e.currentTarget.dataset.id
      // let activeAuth = e.currentTarget.dataset.auth //活动权限，内页视角，1：表示发布者视角；0表示参与者视角
      // console.log('activeAuth', activeAuth)
      let {
        id,
        auth
      } = e.currentTarget.dataset
      wx.navigateTo({
        url: '/pages/activities/activityDetail?id=' + id
      })
      //发布者视角
      // if (activeAuth == 1) {
      //   wx.navigateTo({
      //     url: '/pages/activities/preview?activityId=' + activeDetailId + '&lookSign=' + this.data.lookSign
      //   })
      //   //参与者视角
      // } else if (activeAuth == 0) {
      //   wx.navigateTo({
      //     url: '/pages/activities/activityDetail?id=' + activeDetailId
      //   })
      // }


    },
    gotoPay(e) {
      const formId = e.detail.formId
      debug.log(e)
      wx.navigateTo({
        url: '/pages/activities/confirm?orderId=' + this.data.activity.OrderId + '&formId=' + formId
      })
    }
  },

})