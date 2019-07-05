// components/qaList/qaList.js
let util = require('../../utils/util_wenda');
let config = require('../../config');
const {
  Payfor_answer,
  SaveFormID
} = require('../../utils/Class.js')
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */

  properties: {
    plList: {           //评论列表
      type: Array,
      value: []
    },
    isDetail: {         //是否为问答详情
      type: Boolean,
      value: false
    },
    questesId: {        //问答id
      type: Number,
      value: null
    },
    isLogin: {           //是否登录
      type: Boolean,
      value: false
    },
    isSelf:{
      type:Number,        //是否为自己
      value:null
    },
    page:{
      type:Number,        //当前页数
      value:null
    },
    master_status:{     //是否答主
      type:Number,
      value:null
    },
    myCard:{
      type:Object,
      value:{}
    }
    
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    plIndex: null,    //评论列表中获取更多事件中的下标
    pages: null,      //总页数
    isLike: false,    //是否点赞
    noReplay: false,   //是否没有评论
    incontent: {}      //音频实例
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      if (this.data.incontent.src){
          this.data.incontent.stop()
      }

    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.setData({

      myCard: wx.getStorageSync('card') || app.globalData.card
      })

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  
  methods: {

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

    //获取手机号码回调
    _confirmEvent: function (opts) {
      console.log(opts)
      let self = this
      let data = {}

      if (opts.currentTarget) {
        data = arguments[0].detail.getPhoneNumberData
      } else {
        data = opts
      }
      // console.info('opts', opts)

      util.request({
        url: config.apiUrl + '/hr/special/wxapp/autoRegister',
        data: data,
        method: "POST",
        autoHideLoading: false,
        withSessionKey: true
      }).then(res => {

        if (res.result == 0) {
          util._setStorageSync('isLogin', 1)
          self.setData({
            ['isLogin']: true
          })
          self.triggerEvent('updateDetailData', {
            isUpdata: true
          })
          util.runFn(self.getInitData)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }

      })
    },

    //支付人气值查看回答
    viewAnswer(e){
      if (!this.data.myCard) {
        console.log("没有名片")
        this.noCard();
        return

      }
      let that = this
      let id = e.currentTarget.dataset.id
      let index = e.currentTarget.dataset.index  


      wx.showModal({
        title: '提示',
        content: '是否支付人气值',
        success(res) {
          if (res.confirm) {
            const parms = {
              plid: id,
              showLoading: true

            }
            Payfor_answer.create(parms).then(res => {
              if (res.result == 0) {
                wx.showToast({
                  title: '支付成功',
                })
                that.data.plList[e.currentTarget.dataset.index].is_pay = true
                that.data.plList[e.currentTarget.dataset.index].pay_count++
                that.setData({
                  plList: that.data.plList
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }

            })
          } else if (res.cancel) {
            return
          }
        }
      })








    },

    //播放语音
    playVoice(e) {
      if (!this.data.myCard) {
        console.log("没有名片")
        this.noCard();
        return

      }
      wx.showLoading({
        title: '加载中...',
      })
      let that = this

      let voiceItem = e.currentTarget.dataset.item          //点击播放语音的item

      let index = e.currentTarget.dataset.index             //点击播放语音的index

      let voicePath = e.currentTarget.dataset.item.music    //点击播放语音的path

      that.data.plList[index].isPause = false               //点击播放后给一个语音是否暂停的标识，默认未暂停

      that.data.plList[index].isPlay = false                //点击播放后给一个语音是否播放的标识，默认未播放

      that.setData({
        plList: that.data.plList
      })

    
      if (!voiceItem.isPlay) {

      //第一次播放，且不是暂停后点击
        if (!voiceItem.isPause) {
          
          let innerAudioContext = wx.createInnerAudioContext()
          //需要将实例存起来，放入data中
          this.setData({
            incontent: innerAudioContext
          })

           that.data.incontent.src = encodeURI(voicePath);
           that.data.incontent.play();

          //语音播放的监听
           that.data.incontent.onPlay(() => {
            wx.hideLoading()
            that.data.plList[index].isPlay = true
            that.data.plList[index].isPause = false   
            that.getVoiceStatus(index, that.data.plList[index].isPause, that.data.plList[index].isPlay)
            that.setData({
              plList: that.data.plList
            })
            console.log('开始播放')
          })

          //语音播放结束的监听
           that.data.incontent.onEnded((res) => {
            that.data.plList[index].isPlay = false
             that.data.plList[index].isPause = false 
             that.getVoiceStatus(index, that.data.plList[index].isPause, that.data.plList[index].isPlay)

            that.setData({
              plList: that.data.plList
            })
            console.log("播放自然结束")
          })

      
            //第二次播放，暂停后继续播放
              } else {
                  that.data.incontent.play();
                  wx.hideLoading()
                  that.data.plList[index].isPlay = true
                  that.data.plList[index].isPause = false 
                  that.getVoiceStatus(index, that.data.plList[index].isPause, that.data.plList[index].isPlay)

                  that.setData({
                    plList: that.data.plList
                  })
            }

             //播放中点击（操作为暂停语音），且不是暂停后点击
          } else if (voiceItem.isPlay && !voiceItem.isPause) {
            that.data.incontent.pause();
            //语音播放暂停的监听
            that.data.incontent.onPause(() => {
              wx.hideLoading()
              that.data.plList[index].isPlay = false
              that.data.plList[index].isPause = true
              that.getVoiceStatus(index, that.data.plList[index].isPause, that.data.plList[index].isPlay)

              that.setData({
                plList: that.data.plList,
                incontent: that.data.incontent
              })
              console.log("语音暂停")

            })
          }
    

    },
    
    //将播放的状态传入父组件，使父组件刷新数据时播放状态不被初始化
    getVoiceStatus(index,isPause,isPlay){
        this.triggerEvent('getVoiceStatus', {
          index: index,
          isPause: isPause,
          isPlay:  isPlay
        })
    },

    //去问题详情页
    toQuestionDetail(e) {
      if (this.data.isDetail) return
      console.log(e.currentTarget.dataset.item.id)
      wx.navigateTo({
        url: '/pages/questionDetail/questionDetail?id=' + e.currentTarget.dataset.item.id,
      })
    },

    //获取更多评论
    getMore(e) {
      let index = e.currentTarget.dataset.index
      if (this.data.plList[index].second.index == this.data.plList[index].second.pages) {
        wx.showToast({
          title: '没有更多了',
        })
        return
      }
      ++this.data.plList[index].second.index
      this.setData({
        plIndex: index,
        plList: this.data.plList
      })
      console.log("e.currentTarget.dataset.index", e.currentTarget.dataset.index)
      console.log('that.data.plList', this.data.plList)

      this.getIndexData(this.data.questesId, e.currentTarget.dataset.pid)
    },

    //获取回复列表
    getIndexData: util.debounce(function (tid, pid) {
      console.log("this.data.plList", this.data.plList)
      console.log("this.data.plList[this.data.plIndex]", this.data.plList[this.data.plIndex])
      console.log("that.data.plList[that.data.plIndex].second.index", this.data.plList[this.data.plIndex].second.index)
      wx.showLoading({
        title: '加载中...',
      })
      let that = this
      util.request({
        url: config.apiUrl + '/hr/group/question/reply_list',
        method: "POST",
        withSessionKey: true,
        data: {
          tid: tid,
          pid: that.data.plList[that.data.plIndex].id,
          page: that.data.plList[that.data.plIndex].second.index
        }
      }).then(res => {
        let repList = that.data.plList[that.data.plIndex].second.data
        let data = res.data.data
        console.log('data', data)
        wx.hideLoading()
        if (res.result == 0) {
          //如果没有下一页就不显示加载更多
          if (that.data.plList[that.data.plIndex].second.index == that.data.plList[that.data.plIndex].second.pages) {
            that.setData({
              noReplay: true
            })
          }
          if (res.data.data) {
            that.data.plList[that.data.plIndex].second.data = that.data.plList[that.data.plIndex].second.data.concat(data)
            that.setData({
              plList: that.data.plList
            })
            console.log('plList', that.data.plList)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }, 500),

    //回复评论
    replay(e) {
      if (!this.data.myCard) {
        console.log("没有名片")
        this.noCard();
        return

      }
      console.log(e.currentTarget.dataset)
      let d = e.currentTarget.dataset
      let that = this
      console.log(this.data.plList)
      if (d.replay) {
        console.log("回复为三级评论")
        let data;
        if(that.data.questesId){
          data = {
            tid: that.data.questesId,
            pid: d.item.id,
            topid: d.replay.id,
          }
        }else{
        data = {
            tid: d.item.tid,
            pid: d.item.id,
            topid: d.replay.id,
          }
        }
        wx.navigateTo({
          url: '/pages/replay/replay?tid=' + data.tid + '&pid=' + d.item.id + '&topid=' + d.replay.id + '&name=' + d.name + '&master_status=' + that.data.master_status,
        })
      } else {
        let data;

        if (that.data.questesId){
          console.log("有that.data.questesId")
          data = {
            tid: that.data.questesId,
            pid: d.item.id,
          }
        }else{
          console.log("没有that.data.questesId",d.item)

           data = {
            tid: d.item.tid,
            pid: d.item.id,
          }
        }
        console.log('回复为二级评论')
        wx.navigateTo({
          url: '/pages/replay/replay?tid=' + data.tid + '&pid=' + d.item.id + '&topid=' + d.item.id + '&name=' + d.name + '&master_status=' + that.data.master_status,
        })
      }
    },

    //没有名片
    noCard() {
      wx.showModal({
        title: '提示',
        content: '您还没有名片，是否立即前往',//已埋登录
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../cards/makeCard',
            })
          }
        }
      })
    },

    //点赞
    like: util.debounce(function (e) {
      if (!this.data.myCard){
        console.log("没有名片")
        this.noCard();
        return
      }
      
      let formId = e.detail.formId

      console.log('点赞的item' + e.currentTarget.dataset.item)
      let id = e.currentTarget.dataset.item.id
      let index = e.currentTarget.dataset.index
      let n = e.currentTarget.dataset.item.is_agree//是否点赞，没点赞0，点过赞1
      if (n == 1) {
        this.setData({
          isLike: true
        })
      } else if (n == 0) {
        this.setData({
          isLike: false
        })
      }
      wx.showLoading({
        title: '加载中...',
      })
      this.data.isLike = !this.data.isLike
      let that = this
      util.request({
        url: config.apiUrl + '/hrloo.php?m=questions&c=index&a=ajax_zan',
        method: "POST",
        withSessionKey: true,
        autoHideLoading: false,

        data: {
          id: id
        }
      }).then(res => {
        wx.hideLoading()

        SaveFormID.find({
          formId: formId
        });

        // console.log('ressssss', res)
        // const parms = {
        //   formid: formId
        // }
        // util.request({
        //   url: config.apiUrl + '/hr/special/wxapp/save_formid_cache ',
        //   method: "POST",
        //   data: parms,
        //   autoHideLoading: false,

        //   withSessionKey: true
        // }).then(res => {
        //   console.log("搜集formid", formId)
        // })


        if (res.result == 0) {

          //点赞成功
          wx.showToast({
            title: res.msg,
          })
          let zanCount = Number(this.data.plList[index].zan_count)
          ++zanCount

          this.data.plList[index].is_agree = '1'
          this.data.plList[index].zan_count = zanCount
          // this.triggerEvent('updateLike', {
          //   isLike : true
          // })
          this.setData({
            plList: this.data.plList
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

  },
})