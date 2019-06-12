const app = getApp();
const allcities = require('../../utils/allcity')
const debug = require('../../utils/debug.js')
const wxNotice =require('../../vendors/WxNotificationCenter.js')
const getLocation= require('../../utils/getLocation.js')
// const  QQMapWX = require('../../vendors/qqmap-wx-jssdk.min.js');
// // 实例化API核心类
// var qqmapsdk = new QQMapWX({
//   key: 'FI7BZ-D33R5-TL5IO-QQVRH-VV672-ZWF6I' // 必填
// });
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectedCity:'全国',
    cities: ['杭州', '天津', '成都', '重庆', '武汉', '杭州', '天津', '成都', '重庆'],
    allCities: allcities,
    selectedCityInfo:{},
    // sky: wx.getStorageSync('sky').length == 0 ? '全国' : wx.getStorageSync('sky')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('sky'))
    const self = this
    wxNotice.addNotification('getCity', self.getCity, self)
  },
  getCity(city){
    debug.log('notice改变globData====')
    app.globalData.selectedCityInfo = city
  },
onShow(){
  debug.log('onshow=====')
  // wx.getSetting({
  //   success:res=>{
  //     if (res.authSetting["scope.userLocation"] == true) {
  //       console.log("用户已开启定位授权");
  //     } else {
  //       wx.showModal({
  //         title: '提示',
  //         content: '是否重新开启定位',
  //         confirmColor: "#4c89fb",
  //         success: res => {
  //           if (res.confirm) {
  //             wx.openSetting({
  //               success: data => {
  //                 if (data.authSetting["scope.userLocation"]) {
  //                   debug.log('重新获取地理位置成功！')
  //                   getLocation.getLocation((selectedCityInfo) => {
  //                     app.globalData.selectedCityInfo = selectedCityInfo
  //                     wxNotice.postNotificationName('getCity', selectedCityInfo)
  //                     wx.switchTab({
  //                       url: '../activities/activities',
  //                     })
  //                     // that.setData({
  //                     //   selectedCityName: app.globalData.selectedCityInfo.city
  //                     // })
  //                     // that.triggerEvent("getNearCities")

  //                   }, () => {
  //                     wx.switchTab({
  //                       url: '../activities/activities',
  //                     })
  //                   })
  //                 }
  //               }
  //             })
  //           }
  //         }
  //       })
  //     }
  //   }
  // })
  // if (app.globalData.selectedCityInfo) {
  //   this.setData({ selectedCityInfo: app.globalData.selectedCityInfo })
  // } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '是否重新开启定位',
  //       confirmColor:"#4c89fb",
  //       success:res=>{
  //         if(res.confirm){
  //           wx.openSetting({
  //             success: data=> {
  //               if (data.authSetting["scope.userLocation"]) {
  //                 debug.log('重新获取地理位置成功！')
  //                 getLocation.getLocation((selectedCityInfo) => {
  //                   app.globalData.selectedCityInfo = selectedCityInfo
  //                   wxNotice.postNotificationName('getCity', selectedCityInfo)
  //                   wx.switchTab({
  //                     url: '../activities/activities',
  //                   })
  //                   // that.setData({
  //                   //   selectedCityName: app.globalData.selectedCityInfo.city
  //                   // })
  //                   // that.triggerEvent("getNearCities")
                    
  //                 }, () => {
  //                   wx.switchTab({
  //                     url: '../activities/activities',
  //                   })})
  //               }
  //             }
  //           })
  //         }
  //       }
  //     })
  // }
},
  binddetail(e) {
    console.log(e.detail)
    getLocation.getLocationData(e.detail.name,res=>{
      wxNotice.postNotificationName('city', { city: e.detail.name,data:res})
      setTimeout(function () {
        wx.navigateBack()
      }, 500)
    })



    // 返回 例 :{name: "北京", key: "B", test: "testValue"}
  }
})