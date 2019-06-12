// component/moreMenu/moreMenu.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuList: {
      type: Array,
      value: [{
        name: 'test',
        path: '../../pages/index/index'
      }]
    },
    direction: {
      type: String,
      value: 'vertical'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showMask: false,
    isTop: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMenuPath: function(e) {
      console.log(e)
      const menu = e.currentTarget.dataset.item
      this.setData({
        showMask: false,
      })
      if(menu.path){
        wx.navigateTo({
          url: menu.path,
        })
      }else{
        this.triggerEvent('tapMenu',{menu})
      }

    },
    openMenu: function() {
      const that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('#menu').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        const top = res[0].top
        console.log(top)
        // wx.getSystemInfo({
        //   success: function (res) {
        const height =  app.globalData.windowHeight
        console.log(height)
        console.log(that.data.menuList.length)
        if ((height - top) > that.data.menuList.length * 50) {
          that.setData({
            showMask: true,
            isTop: true,
          })
        } else {
          that.setData({
            showMask: true,
            isTop: false,
          })
        }
        //   }
        // })
      })
    },
    closeMenu: function() {
      this.setData({
        showMask: false,
      })
    },
    myCatchTouch: function () {
      console.log('stop user scroll it!');
      return;
    },
  }
})
