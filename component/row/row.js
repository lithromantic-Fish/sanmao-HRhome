const app = getApp()
//左右条目布局组件
Component({
  options:{
    addGlobalClass:true
  },
  properties: {
    type:{
      type:String,
      value:null
    },
    content:{
      type:String,
      value:null
    },
    pathUrl:{
      type:String,
      value:null
    },
    icon:{
      type: String,
      value: null
    },
    hover:{
      type:String,
      value:'none',
    },
    isVip:{
      type:Boolean,
      value:false
    },
    red_point:{
      type:Number,
      value:null
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    mycard: ''
  },
  attached: () => {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    gotoPage(){
      let {
        pathUrl,
        type,
        content
      } = this.data
      if (pathUrl) {

        if (type != '关于我们' && !wx.getStorageSync('card')) {
          wx.showModal({
            title: '提示',
            content: '您还没有名片，是否立即前往',//已埋登录
            success: res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/cards/makeCard',
                })
              }
            }
          })          
          return
        }
        wx.navigateTo({
          url: pathUrl,
        })
      }
    }

  }
})
