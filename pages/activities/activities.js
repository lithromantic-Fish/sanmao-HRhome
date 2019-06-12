
const app = getApp();
const debug = require('../../utils/debug.js')
const location = require('../../utils/getLocation.js')
const login = require('../../utils/login.js')
const notice = require('../../vendors/WxNotificationCenter.js')
const {
  Activity,
  ActivityNearBy,
  HotActivity
} = require('../../utils/Class')
let code = null
let userInfo = null;
// const tabs = [{
//     title: '全部活动',
//     url: Activity,
//     page:1,
//     loadAll:false
//   },
//   {
//     title: '附近的活动',
//     url: ActivityNearBy,
//     page:1,
//     loadAll: false
//   }

// ]
// let selectedTab = tabs[0]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部活动', '附近的活动'],
    activities :[], //活动数组
    allActivityPage:1,   //全部活动页数
    nearActivityPage:1,  //附近活动页数
    loadAll: false,
    selectTab:1,         //选中的tab，默认第一页
    city:''
  },

  onLoad: function(options) {

    const that =this
    var city = ''
    // activities = [];
    // selectedTab = tabs[0]
    // selectedTab.page=1
    // selectedTab.loadAll=false
    code=null
    const name = ''
    // this.setData({activities:data.activities})
    location.getLocation(selectedCityInfo => {
 
      app.globalData.selectedCityInfo = selectedCityInfo
      console.log(selectedCityInfo)
      notice.postNotificationName('Addcity', selectedCityInfo)

      // if (!app.globalData.selectedCityInfo.cityCode) {
      //   code ='110000'
      // } else {
      code = app.globalData.selectedCityInfo.cityCode
      // }
      // this.getActivities(code);
      // if (app.globalData.selectedCityInfo){
      //   that.setData({
      //     selectTab:2
      //   })
      //   console.log(2)
      // }else{
      //   console.log(1)
      //   that.setData({
      //     selectTab:1
      //   })
      // }
  
    }
    , () => {
      code = '110000'
      // this.getActivities(code)

    }
    )
    if (app.globalData.selectedCityInfo){
      this.setData({
        selectTab: 2,
      })
      city = app.globalData.selectedCityInfo.city
    }else{
      this.setData({
        selectTab: 1,

      })
      city = ''
    }
    this.getActivity(this.data.selectTab, city, name)
    notice.addNotification('city', that.changeCities, that)
    notice.addNotification('getCity', that.getNewCities, that)
    if (app.globalData.userInfo) {
      userInfo = app.globalData.userInfo
      this.setData({
        userInfo,
        // selectedTab
      })
    }
  },
onShow(){
  if(app.globalData.userInfo){
    userInfo = app.globalData.userInfo
    this.setData({ userInfo })
  }
},
  getActivities(code) {
    debug.log('用户位置=', app.globalData.selectedCityInfo)
    // if (app.globalData.selectedCityInfo && selectedTab.title === '附近的活动') {
    //   const location = app.globalData.selectedCityInfo.location
    //   const query = {
    //     latitude: location[1],
    //     longitude: location[0],
    //     page: selectedTab.page
    //   }
    //   return ActivityNearBy.find({
    //     query
    //   }).then(res => {
    //     const load = 'selectedTab.loadAll'
    //     debug.log(res)
    //     if (res.list.length === 0) {
    //       this.setData({
    //         [load]: true
    //       })
    //     } else {
    //       if(selectedTab.page===1){
    //         this.setData({
    //           activities: res.list.data
    //         })
    //       }else{
    //         this.setData({
    //           activities: activities.concat(res.list.data)
    //         })
    //         selectedTab.page = selectedTab.page+1
    //       }
    //     }
    //   })
    // } else {
    //   code = code.substring(0,4)
    //   let query = {
    //     page: selectedTab.page,
    //     code:code
    //   }
    //   const load = 'selectedTab.loadAll'
    //   return Activity.find({query}).then(res => {
    //     debug.log(res)
    //     if (res.length === 0) {
    //       this.setData({
    //         [load]: true
    //       })
    //     } else {
    //       if (selectedTab.page === 1){
    //         this.setData({
    //           activities: res.list.data
    //         })
    //       }else{
    //         this.setData({
    //           activities: activities.concat(res.list.data)
    //         })
    //         selectedTab.page = selectedTab.page+1
    //       }
    //     }
    //   })
    // }
  },
  //获取活动列表 ------全部活动/附近的活动
  getActivity(tabNum,city,name){   //一个tab参数，一个搜索名称
    debug.log('用户位置=', app.globalData.selectedCityInfo)
    console.log('进')
        const parms = {
          tab: tabNum,
          city: city,
          name: name,
          page: tabNum==1?this.data.allActivityPage:this.data.nearActivityPage
        }
 
        HotActivity.create(parms).then(res => {
          let activeList = res.data.data

          if(res.data.data){
            if (res.data.pages == 1 ||res.data.pages==parms.page){
              this.setData({
                loadAll: true
              })
            }
            //第一页
            if (parms.page == 1) {
              this.setData({
                activities: activeList
              })
            } else {
              //分页
              this.setData({
                activities: [...this.data.activities, ...activeList]
              })
            }

     
          }else{
            this.setData({
              activities: []
            })
          }
        })

  },

  //下拉刷新
  onPullDownRefresh: function () {
    if (!app.globalData.selectedCityInfo){
      this.setData({
        city: ''
      })
    }else{
      this.setData({
      city : app.globalData.selectedCityInfo.city
      })
    }
    if (this.data.selectTab==1){
      this.setData({
        allActivityPage: 1,
        loadAll: false
      })
    }else{
      this.setData({
        nearActivityPage: 1,
        loadAll: false
      })
    }
    var name = ''
    this.getActivity(this.data.selectTab, this.data.city, name)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
  },

  //上拉加载更多
  onReachBottom: function () {
    console.log(111111111)
    let {
      selectTab,
      allActivityPage,   //全部活动页数
      nearActivityPage,  //附近活动页数
      loadAll
    } = this.data
    if (selectTab==1){
      if (!loadAll) {
        this.setData({
          allActivityPage: ++allActivityPage
        })
        var name = ''
        var city = ''
        console.log('app.globalData.selectedCityInfo.city', app.globalData.selectedCityInfo.city)
        this.getActivity(1, city, name)
    }


      // this.getActivity(this.data.selectTab,)
    }
    else if (selectTab == 2) {
      console.log('loadAll',loadAll)
      if (!loadAll) {
        this.setData({
          nearActivityPage: ++nearActivityPage
        })
        var name = ''
        this.getActivity(2, app.globalData.selectedCityInfo.city, name)
      }
    }

  },

  //切换活动的tab
  changeStatus(e) {
    debug.log(e)
    const tab = e.detail.tab
    if (tab=="全部活动")
    {
      this.setData({
        selectTab:1,
        allActivityPage:1,
        loadAll: false
      })
        const name = ''
        const city = ''
      this.getActivity(1, city,name)

    } else if (tab=="附近的活动"){
      // 如果没有获取位置权限
      if (!app.globalData.selectedCityInfo ) {
        this.setData({
          activities:[]
        })
        wx.showToast({
          title: '请先获取位置信息',
          icon:'none'
        })
      }else{
        console.log('来了这')
      this.setData({
        selectTab: 2,
        nearActivityPage: 1,
        loadAll: false
      })
        const name = ''
      this.getActivity(2, app.globalData.selectedCityInfo.city,name)
      }
      
    }

    // if (tab) {
    //   selectedTab = tabs.find(item => {
    //     return item.title === tab
    //   })
    //   this.setData({
    //     selectedTab
    //   })
    //   this.getActivities(code)
    // }
  
},
// onPullDownRefresh: function() {
//   const load = 'selectedTab.loadAll'
//   selectedTab.page = 1
//   this.setData({
//     [load]: false
//   })
//   this.getActivities(code).then(res => {
//     wx.hideNavigationBarLoading()
//     wx.stopPullDownRefresh()
//   })
// },
// onReachBottom: function() {
//   const {
//     loadAll
//   } = selectedTab
//   if (!loadAll) {
//     this.getActivities(code)
//   }
// },
// getInfo(e) {
//   console.log(e)
//   this.setData({
//     userInfo: e.detail.userInfo
//   })
//   wx.setStorageSync('userInfo', e.detail.userInfo)
//   app.globalData.userInfo = e.detail.userInfo
// },
  getInfo(e) {
    console.log(e)
    this.setData({ userInfo: e.detail.userInfo })
    wx.setStorageSync('userInfo', e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    // wx.login({
    //   success: res => {
    //     login.login(res.code, app.globalData.userInfo).then(res => {
    //       debug.log(res)
    //     })
    //   }
    // })
  },
changeCities(city){
  debug.log('changeCity',city)
  code = city.data.result.ad_info.adcode
  // this.getActivities(code)
  const name =''
  this.getActivity(this.data.selectTab, city.city, name)
},
getNewCities(city){
  debug.log('重新获取到的city信息==',city)
  debug.log('changeCity', city)
  code = city.districtCode
  const name = ''

  this.getActivity(this.data.selectTab, city.city, name)

  // this.getActivities(code)
}
})