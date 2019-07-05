const app = getApp()
const debug = require('../../utils/debug')
const data = require('../../mock/index')
const { Comment, AddComment, AddActivityPL, DeleteComment, ActComment, DelActivityPL, GetActivityPL, ActAddCom, ActDelCom} = require('../../utils/Class')
let config = require('../../config');
const util_wenda = require('../../utils/util_wenda');

let id
let type
let url = Comment
let addUrl = AddComment
let delUrl = DeleteComment
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    content:'',
    activeId:null,
    totalPages:null
  },
  // bindfocus: function (e) {
  //   this.setData({
  //     sky: 'inherit'
  //   })
  // },
  // bindblur: function (e) {
  //   this.setData({
  //     sky: 'fixed'
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('optitmts',options)
    id = options.id
    
   url = Comment
   addUrl = AddComment
   delUrl = DeleteComment
    type = options.type ? options.type:null
    this.setData({
      type,
      activeId: options.id
    })
    if(options.type){
      url = ActComment
      addUrl = ActAddCom
      delUrl = ActDelCom
    }

    this.getComments()
  },
  //获取评论列表
  getComments(args){
    const parms = {
      showLoading: true,

      page: this.data.page,
      activity_id: this.data.activeId
    }
  
    // GetActivityPL.create(parms).then(res=>{
      util_wenda.request({
        url: config.hrlooUrl + GetActivityPL,
        autoHideLoading: false,
        data: parms,
        method: "POST",
        withSessionKey: true
      }, this.getComments, args).then(res => {

      if (this.data.page==1) {
        this.setData({
          totalPages: res.data.pages,
          comments: res.data.data
        })
      }else{
        console.log(this.data.comments)
        console.log(res.data.data)
        this.setData({
          totalPages:res.data.pages,
          comments: [...this.data.comments, ...res.data.data]
        })
      }
  
    })
    // url.get(`${id}/${app.globalData.openid}`).then(res=>{
    //   debug.log(res)
    //   if(res.list && res.list.length>0){
    //     this.setData({
    //       comments:res.list
    //     })
    //   }else{
    //     this.setData({
    //       comments: []
    //     })  
    //   }
    // })
  },
  //编辑评论
  getContent(e){
    this.setData({
      content:e.detail.value
    })
  },
  //提交评论
  addComment(){
    const {content} = this.data
    if(!content.length){
      wx.showToast({
        title:'您还没有输入内容哦',   
      })
  
    }else{
      // let data
      // if(this.data.type){

      //     data = {
      //       "ComContents": content,
      //       "OpenId": app.globalData.openid,
      //       "ActivityId": id
      //     }

      // }else{
      //   data = {
      //     "ComContents": content,
      //     "OpenId": app.globalData.openid,
      //     "VideoId": id
      //   }
      // }
      // addUrl.create(data).then(res=>{
      //   debug.log(res)
      //   wx.showToast({
      //     title:'评论成功',
      //     icon:'success',
      //     duration:2000
      //   })
      //   this.setData({
      //     content:''
      //   })
      //   this.getComments()
      // })
      const parms = {
        showLoading: true,

        text: this.data.content,
        activity_id:this.data.activeId
      }
      // AddActivityPL.create(parms).then(res=>{
        util_wenda.request({
          url: config.hrlooUrl + AddActivityPL,
          autoHideLoading: false,
          data: parms,
          method: "POST",
          withSessionKey: true
        }, this.addComment).then(res => {
          if(res.result==0){

        this.getComments()
           wx.showToast({
          title:'评论成功',
          icon:'success',
          duration:2000
        })
        this.setData({
          content: ''
        })
     }

    
      })
    }
  },

  //下拉刷新
  onPullDownRefresh: function () {
    console.log('1111111')
    // this.setData({
    //   page:1
    // })
    // this.getComments(this.data.page)
  },
  //上拉加载更多
  onReachBottom: function () {
    console.log('1111111',this.data.page)
    console.log('112341412',this.data)
    console.log('2222222', this.data.comments.pages)
    
    if (this.data.totalPages == this.data.page){
      wx.showToast({
        title: '已加载全部',
        icon: 'success',
        duration: 2000
      })
    }else{
      this.data.page++;
      this.getComments(this.data.page)
    }
  },
  delete(e){
    let content = e.currentTarget.dataset.item
    if (e.currentTarget.dataset.item.self!=1)return
    let plid = e.currentTarget.dataset.item.id
    console.log(content)
    wx.showModal({
      title: '提示',
      content: '是否删除评论'+content.text,
      confirmColor: "#4c89fb",
      success:res=>{

        if(res.confirm){
          this.deleteComments(plid)


        }
      }

    })
    
    // let comment = e.currentTarget.dataset.item
    // if(comment.OpenId!==app.globalData.openid){
    //   return 
    // }
    // wx.showModal({
    //   title:'提示',
    //   content:'是否删除评论：'+comment.ComContents,
    //   confirmColor:"#4c89fb",
    //   success:res=>{
    //     if(res.confirm){
    //       let id 
    //       if(this.data.type){
    //         id = comment.AComId
    //       }else{
    //         id = comment.ComId
    //       }
    //       delUrl.get(id).then(res=>{
    //         debug.log(res)
    //         wx.showToast({
    //           title:'删除成功',
    //           icon:'success',
    //           duration:2000
    //         })
    //         this.getComments()
    //       })
    //     }
    //   }
    // })

  },

  deleteComments(plid){
    const parms = {
      showLoading: true,

      plid: plid
    }

    util_wenda.request({
      url: config.hrlooUrl + DelActivityPL,
      autoHideLoading: false,
      data: parms,
      method: "POST",
      withSessionKey: true
    }, this.deleteComments, plid).then(res => {

      // DelActivityPL.create(parms).then(res=>{
      if (res.result == 0) {

        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
      }
      // else {
      //   wx.showToast({
      //     icon: 'info',
      //     title: res.msg,
      //     duration: 2000
      //   })
      // }
      this.getComments()
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})