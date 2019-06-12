//tab选择组件
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    items: {
      type: Array,
      value: []
    },
    selectTab: {
      type: Number,
      value: null
    }

  },


  data: {
    selectedTab: ''

  },
  ready() {
    console.log(this.data.items)
    console.log(this.data.selectTab)
    // wx.hideShareMenu()
    //如果是精选活动
    if (this.data.selectTab){

      if (this.data.selectTab == 1) {
        console.log('1')
        this.setData({
          selectedTab: this.data.items[0]
        })
      } else {
        console.log('2')
        this.setData({
          selectedTab: this.data.items[1]
        })

      }
    }else{
      this.setData({
        selectedTab: this.data.items[0]
      })
    }
  },
  methods: {

    changeTab(e) {
      let selectedTab = this.data.selectedTab
      const tab = e.currentTarget.dataset.tab
      if (tab !== selectedTab) {
        this.setData({
          selectedTab: tab
        })
      }
      this.triggerEvent('gotoLoad', { tab })
    },

  }
})
