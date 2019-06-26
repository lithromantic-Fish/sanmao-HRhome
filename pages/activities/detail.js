const data = require('../../mock/index.js')
const app = getApp()
const { Referral, DetailContext} = require('../../utils/Class.js')
const debug = require('../../utils/debug.js')
const WxParse = require('../../vendors/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    imgs:[]
  },
  onLoad: function (options) {
    console.log(options)
    console.log("app.globalData.card", app.globalData.card)
      this.getContext(options.id)
    // var str = options.activeContent.substring(1,options.activeContent.length-1)
    // console.log('str',str)
    // var a = str.replace(/\n/g,"1")
    // this.data.imgs.push()
    var  img = JSON.parse(options.images)
    if (!img){
        img = []
    }else{
      img = img
    }
    this.setData({
      imgs: img

    })
    // const that =this
    // Referral.get(options.id).then(res=>{
    //   debug.log(res)
    //   var temp = WxParse.wxParse('article', 'html', res.list[0].ActivityDetails, that, 5);
    //   let images= []
    //   if (res.list && res.list.length > 0 && res.list[0].DescImages){
    //     images = res.list[0].DescImages
    //   }
    //   this.setData({
    //     article: temp,
    //     images,
    //   })
    // })
  },
  getContext(id){
    const parms = {
      id :id
    }
    DetailContext.find(parms).then(res=>{
      if(res.result==0){
        console.log('res',res.data.desc)
        this.setData({
          detail: res.data.desc
        })
      }
      else{
        console.log('result不为0',res)
      }
      })
  },
  previewImage(e) {

    const { index } = e.currentTarget.dataset
    let array = this.data.images
    let imageArray = array.map(item => {
      return app.globalData.uploadUrl + item
    })
    console.log(index, imageArray)
    wx.previewImage({
      urls: imageArray,
      current: index
    })

  }
})