const app = getApp()
const login = require('../../utils/login.js')


const {
  ChangeCard,
  CardDetail,
  SaveFormID,
  Card,
  LikeCard,
  FavCard,

  Consent,
  CNXH_All,
  CNXH_City,
  CNXH_Industry,
  GetReferrals,
  DeleteCards,
  UnStar,
  Star,
  UnLikeCard,
  LookCard,
  AddRemark,
  Remake 
} = require('../../utils/Class.js')
let util = require('../../utils/util_wenda');
let config = require('../../config');

let aggress = false
let likeLoading = false
const navs = [{
    title: '全部',
    url: CNXH_All
  },
  {
    title: '同城',
    url: CNXH_City
  },
  {
    title: '同行',
    url: CNXH_Industry
  },
  {
    title: '二度人脉',
    url: GetReferrals
  }

]
let selectedTab = navs[0]
let myCard = ''
let self = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: null,
    // nav: ['全部', '同行', '同城', '二度人脉'],
    nav: ['全部', '同行', '同城'],
    cards: '',
    is_exchange: null,
    liked: false,
    card: null,
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    self = this
    myCard = wx.getStorageSync('card') || app.globalData.card
    // myCard = app.globalData.card
    console.log("myCard", myCard)
    self.setData({
      card_id: options.card_id ? options.card_id : '',
      isLogin: util._getStorageSync('isLogin') == 1 ? true : false

    })
    // aggress = false
    // console.log(options)

    // if (options.from === 'aggress') {
    //   aggress = true
    // }
    // card = null
    console.log('1',wx.getStorageSync('card'))
    console.log('2', app.globalData.card)

  
    self.getCardInfo()

  },
  onShow(){

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

  /**
   * 获取名片信息
   */
  getCardInfo() {
    let {
      card_id
    } = self.data

    let params = {
      card_id: card_id,
      showLoading:true
    }
    util.request({
      url: config.hrlooUrl + CardDetail,
      autoHideLoading: false,
      data: params,
      method: "POST",
      withSessionKey: true
    }, self.getCardInfo).then(res => {
    // CardDetail.find(params).then(res => {

      if (res && res.result === 0) {
 
        if (res.data.myself) {
          wx.redirectTo({
            url: '/pages/account/myCardDetail',
          })
          return
        }else{
          if (res.data.card_info.change_status == 2) {
            wx.setNavigationBarTitle({
              title: res.data.card_info.nickname + '的名片'
            })
          } else {
            wx.setNavigationBarTitle({
              title: '名片详情'
            })
          }
        }

        let {
          card_info,
          is_exchange
        } = res.data;
        let card = card_info

        let menuList = []
        if (card.change_status == 2) {
          menuList = [
            // {
            //   id: 1,
            //   name: '名片分组',
            //   path: '/pages/account/add?card_id=' + card.id
            // },
            {
              id: 2,
              name: '推荐该名片'
            },
            // {
            // id: 3,
            //   name: '屏蔽此人'
            // },
            {
              id: 4,
              name: '举报',
              path: '/pages/cards/report?name=' + card.nickname + '&card_id=' + card.id
            },
            {
              id: 5,
              name: '删除该名片'
            }
          ]
        } else {
          menuList = [{
            id: 4,
            name: '举报',
            path: '/pages/cards/report?name=' + card.nickname + '&card_id=' + card.id
          }, ]
        }
        Object.assign(card, {
          menuList
        })
        self.setData({
          card: card,
          is_exchange: is_exchange
        })
        console.log("1111111",this.data.card)
        if (card.change_status == 2) {
          self.getMoreCards()
        }
      } else if (res.result == 999){
         self.updataApi()
        
      }
      // else {
      //   res.result != 100 && wx.showToast({
      //     title: res.msg,
      //     icon: 'none',
      //     duration: 2000
      //   }) && setTimeout(function() {
      //     wx.navigateBack()
      //   }, 2000)
      // }
    })


  },
  updataApi() {
    const that = this
    console.log("更新登录页")
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.getCardInfo()                    //我的名片详情
          // that.getMoreCards()                       //猜你认识
        })

      }
    })
  },
  /**
   * 交换名片
   */
  ChangeCard(e) {

    let {
      card
    } = self.data
    //debug.log(e)
    // let mycard = wx.getStorageSync('card')
    // console.info(app.globalData)
    // return
    let formId = e.detail.formId
    if (!myCard) {
      self.isCreateCard()
      return
    } else {
      // else {
      // if (aggress) {
      //   const query = {
      //     formId: formId,
      //     id: mycard.id
      //   }
      //   ChangeCard.create(query).then(res => {
      //     conosle.info(res)
      //   })
      //   return
      //   http.post(`/bus/consent/${app.globalData.openid}`, query).then(res => {
      //     debug.log(res.data)
      //     if (res.data.status) {
      //       wx.showToast({
      //         title: '已收入该名片',
      //         duration: 2000,
      //         icon: 'none'
      //       })
      //       let status = 'card.change_status'
      //       this.setData({
      //         [status]: 1
      //       })
      //     } else {
      //       wx.showToast({
      //         title: '同意失败，请稍后再试',
      //         duration: 2000,
      //         icon: 'none'
      //       })
      //     }
      //   })
      // } else {
      // console.info('ChangeCard')
      if (card.id === myCard.id) {
        wx.showModal({
          title: '提示',
          content: '不能交换自己的名片',
          showCancel: false,
          confirmColor: '#4c89fb'
        })
      } else {
        const data = {
          showLoading: true,

          card_id: card.id
        }
        // console.info(data)

        // ChangeCard.create(data).then(res => {

        util.request({
          url: config.hrlooUrl + ChangeCard,
          autoHideLoading: false,
          data: data,
          method: "POST",
          withSessionKey: true
        }).then(res => {

          console.info(res)
          if (res && res.result == 0) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 2000
            })
            self.setData({
              'card.change_status': 1
            })
            self.getMoreCards()
          }else if(res.result==88){
            console.log("没创建名片")
            wx.showModal({
              title: '提示',
              content: '您还没有名片，是否立即前往',//已埋登录
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/cards/makeCard',
                  })
                }
              }
            })
          }else if(res.result==999){
            this.updataApiChange(e)
          }
          else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
            console.log("交换名片错误",res)
          }
        })
        return

        // http.post(`/bus/S/${app.globalData.card.id}/B/${card.id}`, data).then(res => {
        //   debug.log(res)
        //   if (res.data.status) {
        //     wx.showToast({
        //       title: '申请成功',
        //       icon: 'success',
        //       duration: 2000
        //     })
        //   }
        //   const status = 'card.change_status'
        //   this.setData({
        //     [status]: 2
        //   })
        // })

      }
      // }
    }
  },
  updataApiChange(e){
    const that = this
    wx.login({
      success: res => {
        login.login(res.code).then(res => {
          that.ChangeCard(e)
      
        })

      }
    })
  },
  allowChange() {
    wx.showModal({
      title: '提示',
      content: '名片已收入您的名片夹中',
      showCancel: false,
      confirmColor: '#4c89fb'
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/cardPage/cardPage',
    })
  },
  onShareAppMessage: function(res) {

    // console.info('触发分享了', res)
    return {
      title: '这是' + self.data.card.nickname + '的名片，请惠存',
      path: '/pages/cards/cardDetail?card_id=' + self.data.card.id
    }
  },
  addContact() {
    wx.addPhoneContact({
      firstName: this.data.card.nickname, //联系人姓名
      mobilePhoneNumber: this.data.card.mobile, //联系人手机号
    })
  },
  //获取 猜你认识 数据列表
  getMoreCards(opts) {

    let prams = {
      rand: 1
    }
    let args = Object.assign(prams, opts)

    Card.find(args).then(res => {
      // console.info('Card-find', 'in', res)
      if (res && res.result === 0 && res.data) {
        let {
          data
        } = res.data
        self.setData({
          cards: data.data
        })
      }
    })
  },
  //猜你认识 tab
  changeTab(e) {

    // debug.log('changeTab e ', e)
    if (e.detail.tab !== selectedTab.title) {
      let opts = {}
      // console.info('e.detail.tab', e.detail.tab)
      // console.info('self.data.nav', self.data.nav)
      selectedTab = navs.find(item => {
        return item.title === e.detail.tab
      })
      //同行
      if (self.data.nav[1] == e.detail.tab) {
        opts = {
          industry: self.data.card.industry
        }
      }
      //同城
      else if (self.data.nav[2] == e.detail.tab) {
        opts = {
          city: self.data.card.city
        }
      }
      self.getMoreCards(opts)
    }
  },
  //备注
  createTips(e) {
    // console.log(e.detail)
    const data = {
      showLoading: true,

      "remark": e.detail.value,
      "bopenid": this.data.card.openid,
    }
    Remake.create(data).then(res => {
      // debug.log(res)
      if(res.result==0){
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }

    })
  },

  //是否创建名片 没有创建提示区创建
  isCreateCard() {
    if (!myCard) {
      wx.showModal({
        title: '提示',
        content: '您还没有名片，是否立即前往',//已埋登录
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/cards/makeCard',
            })
          }
        }
      })
    }
  },


  /**
   * 收藏名片
   */
  _favCard() {
    if (!myCard) {
      self.isCreateCard();
      return
    }

    let {
      card,
      is_exchange
    } = self.data

    // if (!is_exchange) {
    //   wx.showToast({
    //     title: '还未交换名片哦',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else {

    var parms = {
      showLoading: true,
      card_id: card.id
    }

    util.request({
      url: config.hrlooUrl + FavCard,
      autoHideLoading: false,
      data: parms,
      method: "POST",
      withSessionKey: true
    }, self._favCard).then(res => {

  
    // FavCard.create(parms).then(res => {

      if (res && res.result === 0) {
        res.data && self.setData({
          'card.fav_status': res.data.status
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })


    
    // let id = app.globalData.openid + '/' + this.data.card.id;
    // let starStatus = 'card.CardStatus';
    // if (this.data.card.CardStatus === 0) { // 未收藏 然后被收藏
    //   Star.get(id).then(res => {
    //     console.log(res)
    //     // wx.showToast({
    //     //   title:'取消成功',
    //     //   icon:'success',
    //     //   duration:2000
    //     // })
    //     this.setData({
    //       [starStatus]: 1
    //     })
    //   })
    // } else {
    //   UnStar.get(id).then(res => { // 收藏 然后取消收藏
    //     console.log(res)
    //     // wx.showToast({
    //     //   title:'操作成功',
    //     //   icon:'success',
    //     //   duration:2000
    //     // })
    //     this.setData({
    //       [starStatus]: 0
    //     })
    //   })
    // }

    // }
  },
  // 点赞
  like() {
    console.log('mycard',myCard)
    let self = this

    if (!myCard) {
      self.isCreateCard();
      return
    }

    if (likeLoading) {
      return
    }
    likeLoading = true

    let farourStatus = 'card.zan_status'
    let farour = 'card.zan_count'
    // let card_id = this.data.card.id
    let params = {
      card_id: this.data.card.id
    }
    console.log(this.data.card.zan_status)
    if (this.data.card.zan_status === false) { //未赞
      LikeCard.find(params).then(res => {
        likeLoading = false
        this.setData({
          [farourStatus]: !false,
          [farour]: ++this.data.card.zan_count
        })
      })
    } else {
      LikeCard.find(params).then(res => {
        likeLoading = false
        console.log(res)
        this.setData({
          [farourStatus]: !true,
          [farour]: --this.data.card.zan_count
        })
      })
    }
  },
  /**
   * 发送私信
   */
  gotoContact() {
    let self = this
    console.info(card)
    if (self.data.card.blacklist) {
      wx.showModal({
        title: '提示',
        content: '您已被人举报 暂时无法使用私信',
        showCancel: false,
        confirmColor: '#4c89fb'
      })
    } else {
      wx.navigateTo({
        url: 'contact?card_id=' + this.data.card.id
      })
    }
  },
  //收集用户formid
  submitFormId(e) {
    SaveFormID.create({
      formId: e.detail.formId
    })
  }
})