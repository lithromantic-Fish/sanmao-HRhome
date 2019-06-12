const data = require('../../mock/index.js')
const app = getApp()
const debug = require('../../utils/debug.js')
const {Question,Answerer} = require('../../utils/Class.js')
const tabs = [
  { title: '答主', url:Answerer,loadAll:false},
  { title: '问题', url: Question, loadAll: false },
]
let selectedTab = tabs[0]
const load = 'selectedTab.loadAll'
let answers = []
let users = []
let page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:['答主','问题'],
    selectedTab: selectedTab,
    answers,
    users
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    answers = []
    users = []
    page = 1
    selectedTab = tabs[0]
    this.setData({
      AskPrice:app.globalData.AskPrice
    })
    this.getData()
  },
  getData(){
    const query = {page}
    if(selectedTab.title === '问题'){
      // this.setData({answers:data.answers})
      return Question.find({query}).then(res=>{
        debug.log('问题===',res)
        if(res.list.length===0){
          this.setData({
            [load]: true,
          })
        }else{
          let array = res.list
          if(page===1){
            answers = array
            this.setData({
              answers: answers
            })
          }else{
            answers = answers.concat(array) 
            this.setData({
              answers: answers
            })
          }
        }
       page =page + 1
      })
      // answers = data.answers
      // this.setData({
      //   answers:data.answers
      // })
    }else{
      // this.setData({users:data.users})
     return  Answerer.find({query}).then(res=>{
        debug.log('答主===',res)
        if (res.list.length === 0) {
          this.setData({
            [load]: true,
          })
        } else {
          let array = res.list
          if (page === 1) {
            users = array
            this.setData({
              users: users
            })
          } else {
            users = users.concat(array)
            this.setData({
              users: users
            })
          }
        }
        // this.setData({ users: res.list.data})
       page = page + 1
      })
    }
  },
  changeStatus(e){
    page=1
    answers = []
    users = []
    selectedTab.loadAll=false
    this.setData({ [load]:false})
    debug.log(e)

    const tab = e.detail.tab
    if (selectedTab.title != tab){
      selectedTab = tabs.find(item=>{
        return item.title === tab
      })
      this.setData({ selectedTab})
      if(selectedTab.title==='答主'){
        answers=[]
        this.setData({ answers})
        this.getData()
      }else{
        users=[]
        this.setData({ users })
        this.getData()
      }
    }
  },
  gotoQuizDetail(e){
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url:'answer?id='+id
    })
  },
  onPullDownRefresh: function () {
    if(selectedTab.title==='答主'){
      users=[]
    }else{
      answers=[]
    }
    selectedTab.loadAll=false
    page=1
    this.getData()
    wx.stopPullDownRefresh()

  },

})