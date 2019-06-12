//搜索组件
const notice = require('../../vendors/WxNotificationCenter')
const debug = require('../../utils/debug.js')
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    fliter:{
      type:Boolean,
      value:false,
    },
    chooseCity:{
      type:Boolean,
      value:false,
    },
    search:{
      type:Boolean,
      value:false,
    },
    type: {
      type: String,
      value:'card' ,
    },

  },
  data: {
    choosedCity:'全国'
  },
  ready(){
    const self = this
    notice.addNotification('Addcity',self.changeCity,self)
    notice.addNotification('city', self.changeCity, self)
    notice.addNotification('getCity', self.getCity, self)
  },
  methods: {
    gotoSearch(){
      wx.navigateTo({
        url:'/pages/search/search?type='+this.data.type
      })
    },
    changeCity(city){
      this.setData({
        choosedCity:city.city
      })
    },
    getCity(city) {
      debug.log('组件里面获取到的新的地理位置信息==', city)
      this.setData({
        choosedCity: city.city
      })
    }
  },

})
