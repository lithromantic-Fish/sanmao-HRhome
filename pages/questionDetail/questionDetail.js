// pages/questionDetail/questionDetail.js
let util = require('../../utils/util_wenda');
let config = require('../../config');
// WxParse
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */       
  data: {
    thread: {},          //问题详情页数据
    isLogin: false,      //是否登录
    isSelf: null,        //是否为自己的问题
    page: 1,             //当前页数，默认为1
    pages: null,         //总页数
    questesId: null,     //问题id
    plList: [],          //评论数组
    voiceStatus: {},       //子组件传值---语音播放状态
    master_status:null    //答主状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      console.log(options)
      this.setData({
        questesId: options.id,
      })
    } else {
      console.log("请传入questionId")
    }
    this.getIndexData()
  },

  //关注问题
  followQ(e) {
    let start = e.currentTarget.dataset.start
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    util.request({
      url: config.apiUrl + '/hrloo.php?m=questions&c=index&a=ajax_star',
      method: "POST",
      withSessionKey: true,
      autoHideLoading: false,

      data: {
        tid: that.data.questesId,
        cancel: 0
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result == 0) {
        console.log('')
        wx.showToast({
          title: '关注成功',
        })
        this.getIndexData()

      }
    }).catch(err => {
      wx.showToast({
        title: '关注失败',
        icon: 'none'
      })
    })
  },

  //取消关注
  followC(e) {
    console.log(e)

    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    util.request({
      url: config.apiUrl + '/hrloo.php?m=questions&c=index&a=ajax_star',
      method: "POST",
      withSessionKey: true,
      autoHideLoading: false,

      data: {
        tid: that.data.questesId,
        cancel: 1
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result == 0) {
        wx.showToast({
          title: '取消成功',
        })
        this.getIndexData()
      }
    }).catch(err => {
      wx.showToast({
        title: '取消失败',
        icon: 'none'
      })
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isLogin: util._getStorageSync('isLogin') == 1 ? true : false
    })
    this.getCommentList();
    this.getIndexData();
  },


  //拉起手机授权
  _getPhoneNumber: function (res) {
    console.log(res.detail.encryptedData)
    console.log(res.detail.iv)
    let data = res.detail
    if (data.encryptedData && data.iv) {
      this._confirmEvent(data)
    } else {
      util.gotoPage({
        url: '/pages/login/login'
      })
    }

  },

  /**
   * 获取手机号码回调
   */
  _confirmEvent: function (opts) {
    console.log(opts)
    let self = this
    let data = {}

    if (opts.currentTarget) {
      data = arguments[0].detail.getPhoneNumberData
    } else {
      data = {
        encryptedData: opts.encryptedData,
        iv: opts.iv
      }
    }
    // console.info('opts', opts)

    util.request({
      url: config.apiUrl + '/hr/special/wxapp/autoRegister',
      data: data,
      autoHideLoading: false,

      method: "POST",
      withSessionKey: true
    }).then(res => {

      if (res.result == 0) {
        util._setStorageSync('isLogin', 1)
        self.setData({
          ['isLogin']: true
        })
        //授权后重新获取详情页数据
        this.getCommentList();
        this.getIndexData();
        util.runFn(self.getInitData)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    })
  },


  //获取详情数据
  getIndexData: util.debounce(function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    util.request({
      url: config.apiUrl + '/hr/group/question/detail',
      method: "POST",
      withSessionKey: true,
      autoHideLoading: false,
      data: {
        id: that.data.questesId,
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result == 0) {
        let data = res.data.pls.data
        let article = res.data.thread.text;
        WxParse.wxParse('article', 'html', article, that, 5);
        wx.setNavigationBarTitle({
          title: res.data.thread.nickname + '的提问'
        })

        if (res.data.pls.data) {
          res.data.pls.data.forEach((ele, idx) => {
            ele.second.index = 1 //回复的当前页，默认为1
          })
        }
        that.setData({
          isSelf: res.data.self,
          thread: res.data.thread,
          master_status: res.data.is_master
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      Error(err)
    })
  }, 500),

  //获取回复列表数据
  getCommentList: util.debounce(function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    util.request({
      url: config.apiUrl + '/hr/group/question/reply_list',
      method: "POST",
      withSessionKey: true,
      data: {
        tid: that.data.questesId,
        page: that.data.page
      }
    }).then(res => {
      wx.hideLoading()
      let data = res.data.data
      console.log('data', data)
      if (res.result == 0) {

        if (that.data.page > 1) {
          that.setData({
            plList: that.data.plList.concat(data),
            pages: res.data.pages
          })
        } else {
          if (!res.data.data) {
            this.setData({
              plList: [],
              pages: res.data.pages
            })
          } else {
            that.setData({
              plList: res.data.data,
              pages: res.data.pages
            })
          }
        }
        //将子组件播放状态赋上
        that.data.plList.forEach((ele, index) => {
          ele.second.index = 1
          if (that.data.voiceStatus) {
            if (that.data.voiceStatus.index == index) {
              ele.isPause = that.data.voiceStatus.isPause
              ele.isPlay = that.data.voiceStatus.isPlay
            }
          }
        })
        that.setData({
          plList: that.data.plList
        })
      }
    }).catch(err => {
      Error(err)
    })
  }, 500),


  // 登录授权后更新详情页--子组件传值
  _updateDetailData(args) {
    console.log("args", args)
    if (args.detail.isUpdata) {
      this.getCommentList();
      this.getIndexData();
    }
  },

  //获取语音播放状态--子组件传值
  _getVoiceStatus(args) {
    console.log('args', args.detail)
    this.setData({
      voiceStatus: args.detail
    })
  },

  //音频回答
  toVoiceAnswer() {
    wx.navigateTo({
      url: '/pages/answerQuesion/answerQuesion?questionId=' + this.data.questesId + '&view_count=' + this.data.thread.view_count + '&master_status=' + this.data.master_status,
    })
  },

  //文字回答
  toTextAnswer() {
    wx.navigateTo({
      url: "/pages/answerQuesionText/answerQuesionText?questionId=" + this.data.questesId + '&master_status=' + this.data.master_status,
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新，回到第一页
    this.setData({
      page: 1
    })
    this.getCommentList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.plList || this.data.plList.length == 0) return
    let addPage = this.data.page
    if (addPage == this.data.pages) {
      wx.showToast({
        title: '已加载全部'
      })
      return
    } else {
      ++addPage
      this.setData({
        page: addPage
      })
    }
    this.getCommentList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {

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
})