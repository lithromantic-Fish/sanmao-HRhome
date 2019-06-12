const app = getApp()
const debug = require('../../utils/debug')
const {DeleteAnswer} = require('../../utils/Class')
const eventBus = require('../../utils/eventbus')
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    answer:{
      type:Object,
      value:{}
    },
    card:{
      type:Object,
      value:{}
    }

  },

  data: {

  },
  // pageLifetimes: {
  //   show() {
  //     let answer = this.data.answer
  //     this.setData({
  //       answer: Object.assign(answer, this.data.card)
  //     })
  //   }
  //   },
  // ready(){
    
  // },
  methods: {
    delete(){
      wx.showModal({
        title:'提示',
        content:'确认删除本条回答吗',
        confirmColor:'#4c89fb',
        success:res=>{
          if(res.confirm){
            DeleteAnswer.get(this.data.answer.AnsId).then(res=>{
              wx.showToast({
                title:'删除成功',
                icon:'success',
                duration:2000
              })
              eventBus.emit('deleteAnswer')
            })
          }
        }
      })
    }
  }
})
