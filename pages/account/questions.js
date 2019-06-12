const data = require('../../mock/index.js')
const debug = require('../../utils/debug.js')
const app =getApp()
const { MyQuiz, DoAnswerer, Answered, MyOnlooker} = require('../../utils/Class.js')
let tabs = [
  { title: '我的提问', url: MyQuiz,},
  { title: '我的围观', url: MyOnlooker, },
  { title: '已回答', url: Answered, },
  { title: '待回答', url: DoAnswerer, },
]
let Tabs = ['我的提问','我的围观']
let selectedTab = tabs[0]
let questions= []
Page({

  data: {
    Tabs: Tabs ,
    selectedTab :selectedTab,
    unAnswer:'other'
  },

  onLoad: function (options) {
    selectedTab = tabs[0]
    questions = []
    if(app.globalData.user.Answerer==2){
      Tabs = ['我的提问', '我的围观','已回答','待回答']
    }
    if(selectedTab.title==='待回答'){
      this.setData({ unAnswer:'unAnswer'})
    }
    this.setData({
      selectedTab,
      questions:[],
      Tabs
    })
    this.getQuiz()
    // this.setData({answers:data.answers})
  },
  getQuiz(){
    selectedTab.url.get(app.globalData.openid).then(res=>{
      debug.log(selectedTab.title,'=====',res)
      let list =res.res
      if (selectedTab.title==='我的围观'){
        list=list.map(item=>{
          return Object.assign(item,{status:true})
        })
      }
      debug.log(list)
      this.setData({ questions:list})
    })
  },
  changeStatus(e){
    debug.log(e.detail.tab)
    const { tab } = e.detail
    if (tab !== selectedTab.title) {
      selectedTab = tabs.find(item => {
        return item.title === tab
      })
      if (selectedTab.title==='待回答'){
        this.setData({ unAnswer: 'unAnswer'})
      }
      questions = []
      this.setData({ questions, loadAll: false })
      this.getQuiz()
    }
  }
})