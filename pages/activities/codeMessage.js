let i ;
const app = getApp()
const { Sign} = require('../../utils/Class.js')
const debug = require('../../utils/debug.js')
let activity = null
Page({
  data: {
    seconds:5,
    status:false
  },

  onLoad: function (options) {
    activity = null
    i=null
    const self = this;
    activity = options.id
    Sign.get(app.globalData.openid).then(res=>{
      debug.log(res)
     this.setData({status:res.status})
      i = setInterval(self.countDown, 1000)
    })
  
  },
  countDown(){
    const seconds = this.data.seconds
    console.log(seconds)
    const self = this;
    if(seconds>0){
      this.setData({seconds:seconds-1})
    }else{
      wx.redirectTo({
        url: '/pages/activities/activityDetail?id='+activity,
      })
      clearInterval(i);
    }
  }

})