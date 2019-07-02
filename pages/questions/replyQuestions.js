const data = require('../../mock/index.js')
const debug = require('../../utils/debug.js')
const upload = require('../../utils/upload.js')
const { QuizDetail, Explain}=require('../../utils/Class.js')
const app = getApp()
let answer = null
const recorderManager = wx.getRecorderManager()
let Aoptions = {}
let tempFilePath = null
let fileData = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: tempFilePath

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Aoptions={}
    answer = null
    tempFilePath=null
    fileData =null
    // answer = data.answer
    QuizDetail.get(`${ app.globalData.openid } / ${ options.id }`).then(res=>{
      debug.log(res)
      answer=res.res
      this.setData({ answer: answer, AnswerPrice: app.globalData.AskPrice})
    })
    // this.setData({ answer: answer, AnswerPrice: app.globalData.AnswerPrice})
  Aoptions = {
      // duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
  },
  longTap(){
  debug.log('长摁事件')
  },
  touchStart(){
    recorderManager.start(Aoptions)
    recorderManager.onStart(() => {
      debug.log('recorder start')
    })
  },
  touchEnd(){
    const that =this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      tempFilePath = res
      upload.upload(tempFilePath.tempFilePath).then(res => {
        debug.log('上传音频成功', res)
        res = JSON.parse(res.data) 
        fileData = res.filename
        const aac =app.globalData.uploadUrl+ res.filename
        that.setData({ file: aac,tempFilePath:tempFilePath})
      })
    })
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
  submit(){
    const file = this.data.file
    if(file){
      const duration = this.data.tempFilePath.duration / 1000
      const data = {
        showLoading: true,
        
        Answer: fileData,
        Duration: duration.toFixed(2),
        QuizId: this.data.answer.QuizId,
        OpenId:app.globalData.openid,
        AskPrice: app.globalData.AskPrice
      }
      Explain.create(data).then(res=>{
        debug.log(res)
        wx.showToast({
          title: '回答成功',
          duration:2000
        })
        setTimeOut(()=>{
          wx.navigateBack()
        },2000)
      })
    }
  }
})