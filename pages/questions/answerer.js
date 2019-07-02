const data =require('../../mock/index.js')
const app = getApp()
const debug = require('../../utils/debug.js')
const upload = require('../../utils/upload.js')
const http = require('../../utils/http.js')
const { AnswererDetail,PostQuestions,Order} = require('../../utils/Class.js')
let tempFilePaths =[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio:false,
    tempFilePaths: tempFilePaths,
    AskPrice:null,
    content:''

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tempFilePaths=[]
    // this.setData({answerer:data.answers[0],questions:data.answers,AskPrice: app.globalData.AskPrice})
    AnswererDetail.get(`${options.id}/${app.globalData.openid}`).then(res=>{
      debug.log(res)
      let array = res.list
      if(array && array.length>0){
        array.map(item=>{
          return Object.assign(item,res.res)
        })
      }
      
      this.setData({ answerer: res.res, questions:array, AskPrice: app.globalData.AskPrice})
    })
  },

  // changeRadio(e){
  //   let radio = this.data.radio
  //   this.setData({ radio: !radio})
  // },
  // addPhoto(){
  //   wx.chooseImage({
  //     // count: 3 - tempFilePaths.length,
  //     count: 1,
  //     success: res=> {
  //       debug.log(res)
  //       tempFilePaths = tempFilePaths. concat(res.tempFilePaths) 
  //       this.setData({ tempFilePaths: tempFilePaths})
  //     },
  //   })
  // },
  // deletePhoto(e){
  //   tempFilePaths.splice(e.currentTarget.dataset.index,1)
  //   this.setData({ tempFilePaths})
  // },
  // pay(e){
  //   const content = e.detail.value.content
  //   const Public = e.detail.value.switch

  //   debug.log(e)
  //   if(!app.globalData.card){
  //     wx.showModal({
  //       title: '提示',
  //       content: '您还没有名片，是否立刻制作',
  //       confirmColor:'#4c89fb',
  //       success:res=>{
  //         if(res.confirm){
  //             wx.navigateTo({
  //               url: '../cards/makeCard',
  //             })
  //         }
  //       }
  //     })
  //   }else{
  //     if (this.data.answerer.ClientId === app.globalData.user.ClientId){
  //       wx.showToast({
  //         title: '不能向自己提问哦',
  //         duration:2000
  //       })
  //     }else{
  //       if (content === '') {
  //         wx.showModal({
  //           title: '提示',
  //           content: '提问内容不得为空',
  //           showCancel: false,
  //           confirmColor: '#4c89fb'
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '提示',
  //           content: `是否花费${this.data.AskPrice || 0}人气值进行提问`,
  //           confirmColor: '#4c89fb',
  //           success: res => {
  //             if (res.confirm) {
  //               let quizData = {
  //                 Issue: content,
  //                 Public: Public ? 1 : 0,
  //                 Anonymous: this.data.radio ? 1 : 0,
  //                 QuizzerId: app.globalData.user.ClientId,
  //                 AnswererId: this.data.answerer.ClientId,
  //                 IssueIcon: null,
  //                 AskPrice: app.globalData.AskPrice
  //               }
  //               if (tempFilePaths.length != 0) {
  //                 for (let index in tempFilePaths) {
  //                   upload.upload(tempFilePaths[index]).then(res => {
  //                     const info = JSON.parse(res.data)
  //                     let icon = info.filename
  //                     quizData = Object.assign(quizData, { IssueIcon: icon })
  //                     this.postQuiz(quizData)
  //                   })
  //                 }
  //               }
  //               else {
  //                 this.postQuiz(quizData)
  //               }
  //             }
  //           }
  //         })
  //       }
  //     }
  //   }
  // },
    pay(){
      if(!this.data.content){
        wx.showToast({
          title:'您还没输入内容哦',
          icon:'none',
          duration:2000
        })
        return 
      }
      if(this.data.answerer.OpenId===app.globalData.openid){
        wx.showToast({
          title:'不能向自己提问哦',
          icon:'none',
          duration:2000
        })
      }
      else{
        wx.showModal({
          content: '是否花费' + app.globalData.AskPrice+'人气值提问',
          confirmColor:"#4c89fb",
          cancelText:'不',
          success:res=>{
            if(res.confirm){
              const data = {
                showLoading: true,

                "QuizName": app.globalData.card.BusName,
                "QuizOpenId": app.globalData.openid,
                "QuizContents": this.data.content,
                "AskPrice": app.globalData.AskPrice
              }
              PostQuestions.create(data).then(res => {
                debug.log(res)
                if (res.status) {
                  wx.showToast({
                    title: '提问成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(() => {
                    wx.navigateBack({})
                  }, 2000)
                }else{
                  wx.showToast({
                    title: '人气值不足',
                    icon:'none',
                    duration:2000
                  }) 
                } 
              })
            }
          }
        }) 
      }
  },
  getcontent(e){
    this.setData({
      content:e.detail.value
    })
  }
})