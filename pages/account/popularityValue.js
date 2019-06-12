const {
  MyEvent
} = require('../../utils/Class.js')

const app = getApp()
const debug = require('../../utils/debug.js')
const popularity = [{
    name: 'HR通讯录',
    list: [{
        icon: 'makeCard',
        title: '生成名片',
        description: '生成自己的个人名片自动获得奖励',
        score: 10
      },
      {
        icon: 'switchCard',
        title: '交换名片',
        description: '点开且授权，双方同意交换名片即可自动获得',
        score: 2
      },
      {
        icon: 'inviteCard',
        title: '邀请别人注册名片',
        description: '邀请其他人授权且注册生成名片即可自动获得奖励',
        score: 10
      },
      {
        icon: 'VIPcard',
        title: '名片加V',
        description: '名片加V成功即可获得',
        score: 10
      }
    ],
  },
  {
    name: 'HR活动社区',
    list: [{
        icon: 'enterActivity',
        title: '报名活动',
        description: '个人填写完整资料提交成功即可获得',
        score: 0
      },
      {
        icon: 'signActivity',
        title: '活动现场签到',
        description: '参加活动现场，且扫码签到即可获得',
        score: 10
      },
      {
        icon: 'favorActivity',
        title: '活动点赞',
        description: '已经报名活动完整提交信息的个人，对所有参加的活动进行点赞即可获得',
        score: 1
      },
      {
        icon: 'commentActivity',
        title: '活动评论',
        description: '用文字评论个人已经报名参加的活动即可获得',
        score: 1
      },
      {
        icon: 'makeActivity',
        title: '个人发布活动',
        description: '只允许在小程序注册成功的个人进行发布活动',
        score: 0
      }
    ],
  }
  // ,
  // {
  //   name:'高人指路',
  //   list: [
  //     {
  //       icon: 'teacher',
  //       title: '讲师',
  //       description: '讲师介绍旁边有点赞按钮，1次点赞是1个人气值',
  //       score: 10
  //     },
  //     {
  //       icon: 'answer',
  //       title: '回答问题',
  //       description: '收获1个点赞即可获得1个人气值',
  //       score: 10
  //     }
  //   ]
  // }
]
const levels = {
  leave0: {
    min: 0,
    max: 200,
    middle: 50
  },
  level1: {
    min: 200,
    max: 500,
  },
  level3: {
    min: 500,
    max: 1000,
  },
  level4: {
    min: 1000,
    max: 5000,
  },
  level5: {
    min: 5000,
    max: 100000
  }

}
let level
let selectedTab = popularity[0]

function getRank(e) {
  if (e < 50) return '小白'
  if (e >= 50 && e < 200) return '新秀'
  if (e >= 200 && e < 500) return '高手'
  if (e >= 500 && e < 1000) return '大侠'
  if (e >= 1000 && e < 5000) return '大仙'
  else return '至尊'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs:['HR通讯录','活动广场','高人指路'],
    tabs: ['HR通讯录', 'HR活动社区'],
    list: popularity[0].list,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    MyEvent.find().then(_res => {
      // debug.log(_res)
      let {
        popularity
      } = _res.data
      console.info(popularity)
      // return
      // if (_res.list.BusId) {
        const total = popularity

        for (let i in levels) {
          let item = levels[i]
          if (total >= item.min && total < item.max) {
            level = item
            break
          }
        }

        let percent = (total - level.min) / (level.max - level.min) * 100
        // debug.log(total)
        this.setData({
          rank: getRank(total),
          total: total,
          level,
          percent
        })
        // Particulars.get(app.globalData.openid).then(res => {
        //   debug.log('人气值明细==', res.list)
        //   this.setData({ popularity: res.list, rank: getRank(total), total: total })
        // })
      // }
    })
  },

  changeStatus(e) {
    if (selectedTab.name !== e.detail.tab) {
      selectedTab = popularity.find(item => {
        return item.name === e.detail.tab
      })
      this.setData({
        list: selectedTab.list
      })
    }

  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})