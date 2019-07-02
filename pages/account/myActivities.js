const app = getApp()
const login = require('../../utils/login.js')
const {
  MyActivity
} = require('../../utils/Class')

const tabs = [{
    name: '我参加的',
    type: 1,
    $skip: 0
  },
  {
    name: '我发起的',
    type: 2,
    $skip: 0
  },
  // { name: '待付款的', status: 2, $skip: 0, url: MyDopayment},
  {
    name: '我收藏的',
    type: 3,
    $skip: 0
  },
]

let selectedTab = tabs[0]
let activities = [];
let self = {}

Page({

  data: {
    tabs: ['我参加的', '我发起的', '我收藏的'],
    // tabs:['我参加的','我发起的','待付款的','我收藏的'],
    loadAll: false,
    page: 1,
    type: 1, // 1我参与的  2我发起的  3我收藏的
    activities: []
  },

  onLoad: function(options) {
    self = this
    if(options.tab==2){
      selectedTab = tabs[1];

    }else{
      selectedTab = tabs[0];
    }

    self.getActivities(); //to do
  },
  //顶部tab
  changeStatus(e) { //组件传入的方法，传入的数据{tab}
    // debug.log(e.detail.tab)
    const {
      tab
    } = e.detail
    if (tab !== selectedTab.name) {
      selectedTab = tabs.find(item => {
        return item.name === tab
      })
      self.setData({
        type: selectedTab.type,
        page:1,
        loadAll: false
      })
      // selectedTab.$skip = 0
      this.getActivities()
    }
  },

  /**
   * 获得活动列表
   * type : 
   **/
  getActivities() {
    let {
      type,
      page,
      loadAll
    } = self.data

    let prams = {
      type,
      page
    }

    MyActivity.find(prams).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages
        } = res.data

        if (pages == 1 || pages == page) {
          self.setData({
            loadAll: true
          })
        }
        //第一页
        if (page == 1) {
          self.setData({
            activities: data
          })
        } else {
          //分页
          self.setData({
            activities: [...self.data.activities, ...data]
          })
        }
      }else if(res.result==999){
        self.updataApi()
      }
    })


    // return selectedTab.url.get(app.globalData.openid).then(res => {
    //   debug.log(res)
    //   this.setData({
    //     activities: res.list
    //   })
    //   // if(res.data.length===0){
    //   //   this.setData({loadAll:true})
    //   // }
    // })
    // if(res.data.length===0){
    //   this.setData({loadAll:true})
    // }
  },
  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getActivities()

        })

      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    self.setData({
      page: 1,
      loadAll: false
    })
    self.getActivities().then(res => {
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
      self.getActivities()
    }
  },
  goHome() {
    console.log("11111111")
    wx.redirectTo({
      url: '/pages/activities/activityGround',
    })
  }

})