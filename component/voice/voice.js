const app = getApp()
const {Onlooker} = require('../../utils/Class')
const debug = require('../../utils/debug')
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    answer:{
      type:Object,
      value:{}
    },
    hideName:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  ready(){
    this.setData({
      AskPrice:app.globalData.AskPrice,
      openid:app.globalData.openid
    })
  },
  detached() {
    debug.log('组件被移除')
    let innerAudioContext = this.data.innerAudioContext
    innerAudioContext.stop()
  },
  methods: {
    pay(){
      const {answer,openid}= this.data
      if(answer.isCir!==1 && answer.OpenId !== openid && answer.QuizOpenId!==openid){
        wx.showModal({
          title: '提示',
          content: '是否花' + this.data.AskPrice + '人气值围观该问题',
          confirmColor: '#4c89fb',
          success: res => {
            if (res.confirm) {
              const data = {
                OpenId: app.globalData.openid,
                QuizId: answer.QuizId,
                AskPrice:this.data.AskPrice,
                "AnsId":answer.AnsId,
                "APriceDivide":app.globalData.APriceDivide,
                "QPriceDivide":Number((1 - app.globalData.APriceDivide).toFixed(2)),
              }
              Onlooker.create(data).then(res => {
                debug.log(res)
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                })
                const status = 'answer.isCir'
                this.setData({ [status]:1 })
              })
            }
          }
        })
      }else{
        if(this.data.play){
          return
        }
          const innerAudioContext = wx.createInnerAudioContext('myAudio')
          this.setData({
            innerAudioContext
          })
          // debug.log('开始播放', this.data.file)
          innerAudioContext.src = app.globalData.uploadUrl + this.data.answer.AnsContents
          innerAudioContext.play()
          innerAudioContext.onError((res) => {
            debug.log(res.errMsg)
            debug.log(res.errCode)
            this.setData({
              play: false
            })
          })
          innerAudioContext.onCanplay(() => {
            this.setData({
              play: true
            })
          })
          innerAudioContext.onEnded(() => {
            this.setData({
              play: false
            })
          })
        // }
      }
    },
    // play(){
    //   // play(){
    //     const innerAudioContext = wx.createInnerAudioContext('myAudio')
    //     // debug.log('开始播放', this.data.file)
    //     innerAudioContext.src = app.globalData.uploadUrl+ this.data.answer.AnsContents
    //     innerAudioContext.play()
    //     innerAudioContext.onError((res) => {
    //       debug.log(res.errMsg)
    //       debug.log(res.errCode)
    //     })
    //     innerAudioContext.onCanplay(()=>{
    //       this.setData({
    //         play:true
    //       })
    //     })
    //     innerAudioContext.onStop(()=>{
    //       this.setData({
    //         play:false
    //       })
    //     })
    //   // },
    // }

  }
})
