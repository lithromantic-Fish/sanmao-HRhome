const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    lesson:{
      type:Object,
      value:{}
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
    gotoDetail(){
      wx.navigateTo({
        url:'/pages/questions/classifyLessons?id='+this.data.lesson.ClassifyId
      })
    }
  }
})
