// component/group-card/group-item.js
Component({


  properties: {

    recommendList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    recommendList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toActivity(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/activities/activityDetail?id=' + id
      })
    }
  }
})
