// 问答列表组件
const app = getApp()
const { Onlooker,QuestionLike,QuestionUnLike} = require('../../utils/Class.js')
const debug  = require('../../utils/debug.js')
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
  answer:{
    type:Object,
    value:{}
  },
  answerer:{
    type: Boolean,
    value: false
  },
  unAnswer:{
    type: String,
    value:null
  }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready(){
    this.setData({ AskPrice: app.globalData.AskPrice * app.globalData.APriceDivide,user:app.globalData.user})
  },
  methods: {
    pay() {
      if(!this.data.answer.status){
        var askPrice = app.globalData.AskPrice
        console.log(askPrice)
        wx.showModal({
          title: '提示',
          content: `是否花${askPrice * app.globalData.APriceDivide}人气值围观该问题`,
          confirmColor: '#4c89fb',
          success: res => {
            if (res.confirm) {
              const data = {
                AskPrice: this.data.AskPrice,
                OpenId: app.globalData.openid,
                QuizId: this.data.answer.QuizId,
                ClientId: app.globalData.user.ClientId,
                APriceDivide: app.globalData.APriceDivide,
                QPriceDivide: Number((1 - app.globalData.APriceDivide).toFixed(2))
              }
              Onlooker.create(data).then(res => {
                console.log(res)
                if (res.status) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  })
                  const status = 'answer.status'
                  this.setData({ [status]: { ClientId: app.globalData.user.ClientId, QuizId: this.data.answer.QuizId } })
                }
              })
            }
          }
        })
      }else{
        if (this.data.loading) {
          return
        }
        this.setData({ loading: true })
        const innerAudioContext = wx.createInnerAudioContext('myAudio')
        debug.log('开始播放', this.data.answer.Answer)
        innerAudioContext.src = app.globalData.uploadUrl+this.data.answer.Answer
        innerAudioContext.play()
        innerAudioContext.onError((res) => {
          debug.log(res.errMsg)
          debug.log(res.errCode)
        })
        innerAudioContext.onEnded(() => {
          debug.log('播放结束')
          this.setData({ loading: false })
        })
      }

    },
    gotoPage(){
      if (this.data.unAnswer ==='unAnswer'){
        wx.navigateTo({
          url: '/pages/questions/replyQuestions?id=' + this.data.answer.QuizId,
        })
      }else{
        wx.navigateTo({
          url: '/pages/questions/answer?id=' + this.data.answer.QuizId,
        })
      }
    },
    like(){
      const {answer} = this.data
      let str = 'answer.isLike'
      let num = 'answer.likecount'
      const data = {
        "AnsId":answer.AnsId,
        "OpenId":app.globalData.openid,
        "QuizId":answer.QuizId
      }
      if(answer.isLike===0){
        QuestionLike.create(data).then(res=>{
          console.log(res)
          this.setData({
            [str]:1,
            [num]:++answer.likecount
          })
        })
      }else{
        QuestionUnLike.create(data).then(res=>{
          console.log(res)
          this.setData({
            [str]:0,
            [num]:--answer.likecount
          })
        })
      }
    }    
  }
})
