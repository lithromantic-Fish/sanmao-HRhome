// component/modal/modal.js
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    groupName:{
      type:String,
      value:''
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel(){
      this.triggerEvent('cancel')
    },
    save(){
      if(!this.data.groupName){
        wx.showToast({
          title:'请输入分组名',
          icon:'none'
        })
      }else{
        this.triggerEvent('save', { groupName: this.data.groupName })
      }
    },
    getText(e){
      console.log(e)
      this.setData({
        groupName:e.detail.value
      })
    }
  }
})
