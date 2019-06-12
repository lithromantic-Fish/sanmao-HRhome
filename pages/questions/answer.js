const data = require('../../mock/index.js')
const app = getApp()
const { QuizDetail, Onlooker,Explain}=require('../../utils/Class.js')
const debug = require('../../utils/debug.js')
const upload = require('../../utils/upload')
let answer= null
let loading = false
let answers=[]
let Aoptions
let startPoint
let id
const recorderManager = wx.getRecorderManager()
const { $Toast } = require('../../dist/base/index');
Page({


  data: {
    openid:app.globalData.openid,
    answer,
    answers,
    text:'按住说话'
  },

  onLoad: function (options) {
   
    answer = null
    startPoint =null
    id = options.id
    answers = []
    Aoptions = {
      // duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
this.getQuiz()
  },
  getQuiz(){
    QuizDetail.get(`${id}/${app.globalData.openid}`).then(res=>{
      debug.log(res)
      answer = res.res   
      if(res.list && res.list.length>0){
        answers = res.list.map(item=>{
            return Object.assign(item,item.bus)
        })
      }
      this.setData({answer,answers})
    }
    )
  },
  longTap(){
    debug.log('长摁事件')
  },
  touchStart(e){
    if(!app.globalData.card){
      wx.showToast({
        title:'您还没有名片，请先制作名片哦',
        icon:'none',
        duration:2000
      })
      return 
    }
    recorderManager.start(Aoptions)
    this.setData({
      text:'按住说话'
    })
    $Toast({
      content: '手指上划，取消发送',
      image: 'https://static.hrloo.com/hrloo56/hrhomeminiapp/img/record.png',
      duration: 0,
  });
    startPoint = e.touches[0];
    recorderManager.onStart(() => {
      debug.log('recorder start')
    })
  },
  touchEnd(){
    const that =this;
    this.setData({
      text:'按住说话'
    })
    $Toast.hide();
    recorderManager.stop();
    recorderManager.onStop((res) => {
      let duration = res.duration
      console.log('recorder stop', res)
      if(duration<1000){     
        $Toast({
          content: '说话时间太短',
          image: 'https://static.hrloo.com/hrloo56/hrhomeminiapp/img/warning.png',
        });
        this.setData({
          'text':'按住说话'
        })
      }else{
        let tempFilePath = res
        upload.upload(tempFilePath.tempFilePath).then(res => {
          
          debug.log('上传音频成功', res)
          res = JSON.parse(res.data) 
          // fileData = res.filename
          const aac =app.globalData.uploadUrl+ res.filename
          that.setData({ file: aac,tempFilePath:tempFilePath})
          const data = {
            "AnsName":app.globalData.card.BusName,
            "OpenId":app.globalData.openid,
            "AnsContents":res.filename,
            "QuizId":this.data.answer.QuizId,
            "Duration":(duration/1000).toFixed(2),
            "AskPrice":app.globalData.AskPrice
          }
          Explain.create(data).then(res=>{
            wx.showToast({
              title:'回答成功',
              icon:'success',
              duration:2000
            })
            this.getQuiz()
          })
        })
      }    
    })  
  },
  touchmove(e){
    let moveLenght = e.touches[e.touches.length - 1].clientY - startPoint.clientY; //移动距离
    if (Math.abs(moveLenght) > 50) {
      $Toast.hide();
      recorderManager.stop();
      this.setData({
        text:'按住说话'
      })
    }
  },
  play(){
    const innerAudioContext = wx.createInnerAudioContext('myAudio')
    debug.log('开始播放', this.data.file)
    innerAudioContext.src = this.data.file
    innerAudioContext.play()
    innerAudioContext.onError((res) => {
      debug.log(res.errMsg)
      debug.log(res.errCode)
    })
  },
  reset(){
    tempFilePath=null;
    this.setData({
      file:null
    })
  }, 
  pay() {
    if(!answer.status){
      wx.showModal({
        title: '提示',
        content: '是否花' + this.data.askPrice + '人气值围观该问题',
        confirmColor: '#4c89fb',
        success: res => {
          if (res.confirm) {
            const data = {
              QskPrice: Number((1 - app.globalData.AskPrice).toFixed(2)),
              AskPrice: app.globalData.AskPrice,
              OpenId: app.globalData.openid,
              QuizId: answer.QuizId,
              ClientId: app.globalData.user.ClientId
            }
            Onlooker.create(data).then(res => {
              debug.log(res)
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
              })
              const status = 'answer.status'
              this.setData({ [status]: { ClientId: app.globalData.user.ClientId, QuizId: this.data.answer.QuizId } })
            })
          }
        }
      })
    }else{
      this.play()
    }
  },
// play() {
//     if(loading){
//       return
//     }
//       loading = true

//     let audio = app.globalData.uploadUrl + this.data.answer.Answer
//     debug.log('开始播放', audio)
//        innerAudioContext.src = audio
//       innerAudioContext.play()
//       innerAudioContext.onError((res) => {
//         debug.log(res.errMsg)
//         debug.log(res.errCode)
//       })
//     },
  gotoAnswerer(){
    wx.navigateTo({
      url: 'answerer?id=' + answer.AnswererId,
    })
  }

})