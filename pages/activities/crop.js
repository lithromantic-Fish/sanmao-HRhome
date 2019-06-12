const eventBus = require('../../utils/eventbus.js')
Page({
  data: {
    src: '',
    width: 690,//宽度
    height: 345,//高度
  },
  onLoad: function (options) {
    //获取到image-cropper对象
    this.cropper = this.selectComponent("#image-cropper");
    //开始裁剪
    this.setData({
      src: options.image,
    });
    wx.showLoading({
      title: '加载中'
    })
  },
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e.detail);
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
    this.cropper.getImg(obj=>{
      console.log(obj)
      this.setData({
        result: obj.url
      })
    })
    
  },
  clickcut(e) {
    console.log(e.detail);
    // this.setData({
    //   result: e.detail.url
    // })
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })

  },
  confirm(){
    eventBus.emit('image', {image:this.data.result})
    wx.navigateBack()
  },
  move(){
    this.cropper.getImg(obj=>{
      console.log(obj)
      this.setData({
        result: obj.url
      })
    })
  }
  // getImg(e){
    
  //   console.log('getImage==',e)
  // }
})