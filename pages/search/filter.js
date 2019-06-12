const app = getApp();
const debug = require('../../utils/debug.js')
const {
  Card,
  MyCard
} = require('../../utils/Class.js')
const moment = require('../../vendors/moment.min.js')
// let data = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // roleArr: ['IT 互联网 / 信息技术 / 游戏 / 软件 / 电商','商务服务业 企业服务 / 法律 / 咨询','生活服务业 餐饮 / 酒店住宿 / 居民服务','房地产 开发商 / 物业 / 建筑施工 / 装修','教育培训 市场销售 / 幼教 /','贸易 消费 / 制造 / 营运 / 物流 / 运输','制药 医疗 / 护理 / 卫生','广告 媒体 / 印刷 / 造纸','政府 非盈利组织 / 其他'],
    cards: [], //搜索结果
    arrvalue: [],
    professions: [], //后台获取的 行业列表
    professionText: '请选择行业', //行业列表默认提示
    industry: [],
    postData: { //筛选条件
      // rand: 1,
      city: '',
      industry: '',
      page: 1
    },
    loadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //
    this.getIndustry()

  },
  //获取行业配置信息
  getIndustry() {
    let self = this
    MyCard.find().then(res => {
      if (res && res.result === 0) {
        let {
          industry
        } = res.data
        self.setData({
          professions: industry
        })
      }
    })
  },

  // 根据行业id/name获取名字/id
  // getIndustryResult(pram) {
  //   let self = this
  //   let {
  //     professions
  //   } = self.data
  //   let _type = typeof (pram)
  //   console.info(pram,_type)
  //   if (professions.length) {
  //     for (let i = 0; i < professions.length; i++) {
  //       if (_type == 'number' && professions[i].id == pram) {
  //         conosle.info(professions[i].name)
  //         return professions[i].name
  //       } else if (_type == 'string' && professions[i].name == pram) {
  //         return professions[i].id
  //       }
  //     }
  //     return null
  //   }
  // },
  //选择行业-选择城市
  _change(e) {
    console.info(e)
    let self = this
    let {
      value
    } = e.detail
    let {
      mode
    } = e.currentTarget.dataset
    let {
      professions
    } = self.data

    if (mode == 'industry') {
      self.setData({
        'loadAll': false,
        'professionText': professions[value].name,
        'postData.industry': professions[value].id,
        'postData.page': 1
      })
    } else if (mode == 'city') {
      self.setData({
        'loadAll': false,
        'postData.city': value,
        'postData.page': 1
      })
    }
    self.getFilterData()
  },
  //获取筛选数据
  getFilterData() {
    let self = this
    let {
      postData,
      loadAll
    } = self.data

    if (loadAll) return

    Card.find(postData).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages_num
        } = res.data

        if (pages_num == 1 || pages_num == postData.page) {
          self.setData({
            loadAll: true
          })
        }
        if (postData.page == 1) {
          // 第一页
          self.setData({
            cards: data.data
          })
        } else {
          //分页
          self.setData({
            cards: [...self.data.cards, ...data.data]
          })
        }
      }
    })
  },

  //下拉刷新
  // onPullDownRefresh: function () {
  //   this.setData({
  //     'postData.page': 1,
  //     loadAll: false
  //   })
  //   this.getFilterData().then(res => {
  //     wx.hideNavigationBarLoading()
  //     wx.stopPullDownRefresh()
  //   })
  // },
  //上拉加载更多
  onReachBottom: function() {
    let {
      loadAll,
      postData
    } = this.data

    if (!loadAll) {
      console.info(postData.page++)
      this.setData({
        'postData.page': postData.page++
      })
      this.getFilterData()
    }
  },
})