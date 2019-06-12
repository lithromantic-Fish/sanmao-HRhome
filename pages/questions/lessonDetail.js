let speed 
let width
let id
let VideoContext
const moment = require('../../vendors/moment.min.js')
const data = require('../../mock/index.js')
const app = getApp()
const {LessonDetail,LessonLike,LessonDisLike,LessonLooker} = require('../../utils/Class')
const debug = require('../../utils/debug.js')
const  WxParse = require('../../vendors/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent:0,
    nowText:'00:00',
    total:'03:09',
    x:0,
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    VideoContext = null
    if(!app.globalData.userInfo){
      wx.redirectTo({
        url: '../index/wxAuthorize',
      })
      app.globalData.formLesson = options.id
    }else{
      app.globalData.fromLesson = null
      id = options.id
    }
   
  },

  gotoComment(){
    if(!app.globalData.card){
      wx.showModal({
        title:'提示',
        content:'您还没有名片哦，请先制做自己的名片',
        confirmColor:"#4c89fb",
        success:res=>{
          if(res.confirm){
            wx.navigateTo({
              url:'../cards/makeCard'
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url:'comment?id='+this.data.lesson.VideoId
      })
    }
    
    
  },
  onShow: function () {
    this.getLessonDetail()
  },
  getLessonDetail(){
    LessonDetail.get(`${id}/${app.globalData.openid}`).then(res=>{
      debug.log(res)
      const that =this
      VideoContext = wx.createVideoContext('video')
      const temp = WxParse.wxParse('content','html', res.list.VideoContents, that, 5);
      this.setData({
        lesson:res.list,
        content:temp
      })
    })
  },
  play(){
    console.log('开始判断')
    if (this.data.lesson.VideoPrice>0){
      wx.showModal({
        title: '提示',
        content: '是否支付' + this.data.lesson.VideoPrice + '人气值观看视频',
        confirmColor: "#4c89fb",
        success: res => {
          if (res.confirm) {
            const data = {
              VideoId: this.data.lesson.VideoId,
              OpenId: app.globalData.openid,
              AskPrice: this.data.lesson.VideoPrice
            }
            LessonLooker.create(data).then(res => {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
              })
              this.getLessonDetail()
            })
          }
        }
      })
    }
   
  },
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage(Object){
    return{
      title:this.data.lesson.VideoTitle,
      path:'/pages/questions/lessonDetail?id='+this.data.lesson.VideoId
    }
  },
gotoHome(){
  wx.switchTab({
    url: 'questions',
  })
},
  changeLike(){
    if(!app.globalData.card){
      wx.showModal({
        title:'提示',
        content:'您还没有名片哦，请先制做自己的名片',
        confirmColor:"#4c89fb",
        success:res=>{
          if(res.confirm){
            wx.navigateTo({
              url:'../cards/makeCard'
            })
          }
        }
      })
    }else{
      const {lesson} = this.data
      const data= {
        "VideoId":lesson.VideoId,
        "OpenId":app.globalData.openid
      }
      const str = 'lesson.isLike'
      const num = 'lesson.VideoLike'
      if(lesson.isLike===0){
        LessonLike.create(data).then(res=>{
            this.setData({
              [str]:1,
              [num]:++lesson.VideoLike
            })
        })
      }else{
        LessonDisLike.create(data).then(res=>{
          this.setData({
            [str]:0,
            [num]:--lesson.VideoLike
          })
        })
      }
    }
   
  }
})