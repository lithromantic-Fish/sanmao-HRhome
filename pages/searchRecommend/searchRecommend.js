const app = getApp();
let util = require('../../utils/util_wenda');
let config = require('../../config');
const {
  Card,
  DelSearch,
  ActivityList,
  HotActivity,
  Master_list
} = require('../../utils/Class.js')
// const {
//   Debounce,
// } = require('../../utils/util_wenda.js')

const placeholderTxt = ['搜索姓名/公司/职务', '搜索活动名称','搜索答主','搜索问答']

let self = {}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 5, //type区别不同搜索, 1,搜索名片 4,搜索答主 5搜索问答
    placeholder: '请输入搜索内容', //搜索框默认提示语
    searchResultNullTxt: '没有搜索到相关结果', //搜索无结果提示语
    content: '', //输入框输入内容
    searchResult: [], //搜索结果
    searchHistory: [], //搜索历史
    loadAll: false, //是否加载了全部
    page: 1,//分页默认page
    noResult:false,
    labels: [],             //标签数组
    hasSelectedList: [],    //存储点击过的标签数组
    idList: [],             //标签数组id
    inputVal:'',
    qaList:[],
    answerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getPlaceholder()
    // this.getSearchResult()
    this.getLabelList()
  },
  //获取问题标签
  getLabelList() {
    util.request({
      url: config.apiUrl + '/hr/group/question/get_cates',
      method: "POST",
      withSessionKey: false,
      autoHideLoading: false
    }).then(res => {
      console.log(res)
      res.data.forEach(ele => {
        ele.isSelect = false //是否点击状态，默认未点击
      })
      this.setData({
        labels: res.data
      })
    })
  },
  //标签点击
  _label: function (e) {
    console.log('e',e)
    let {
      name
    } = e.currentTarget.dataset

    this.setData({
      content: name
    })
    console.log('inputVal', this.data.inputVal)
    this.getSearchResult(this.data.content)
    // https://www.hrloo.com/hr/group/question/grp_search

  },

  getPlaceholder(){
    self = this

    // let {
    //   type,
    // } = options
    let _placeholder = ''

    //type区别不同搜索, 1,搜索名片, 2搜索活动
    switch (parseInt(this.data.type)) {
      case 1:
        _placeholder = placeholderTxt[0]
        break;
      case 2:
        _placeholder = placeholderTxt[1]
        break;
      case 4:
        _placeholder = placeholderTxt[2]
        break;
      case 5:
        _placeholder = placeholderTxt[3]
        break;
    }
    self.setData({
      placeholder: _placeholder,
    })
  },

  //切换type
  changeType(e){
    console.log('e',e.currentTarget.dataset.type)
    let type = e.currentTarget.dataset.type
    this.setData({
      type : type
    })
    this.getPlaceholder()

  },
  //获取输入框信息
  getText(e) {
    let self = this
    let {
      value
    } = e.detail
  console.log("value",value)
    if (!value){
      self.setData({
        searchResult:[],
        qaList:[],
        answerList:[],
        noResult:false
      })
    }
    self.setData({
      loadAll: false,
      content: value,
      page: 1
    })
  },
  
  //搜索执行
  getSearchResult() {
    let {
      type,
      page,
      content,
      loadAll
    } = self.data
    console.log('loadAll', loadAll)

    if (loadAll) return
    if(this.data.content=='')return
    let prams = {
      name: content,
      page: page
    }

    //搜索名片
    type == 1 
    if(type==1){
      this.getCardList(prams)
    }
    //搜索问答
   else if(type==5){
     this.searchQuestion(this.data.content)
   }
   //搜索答主
   else if(type==4){
     this.setData({
       page :1
     })
     this.getAnswerList()
   }



  },



  //搜名片
  getCardList(prams){
    Card.find(prams).then(res => {
      console.log("ressss", res)
      if (res && res.result === 0) {
        let {
          data,
          pages_num,
          search
        } = res.data
        console.log("datadatadata", data)
        //如果结果只有一页,或者当前page等于分页数 则是已经加载了全部
        if (pages_num == 1 || pages_num == page) {
          self.setData({
            loadAll: true
          })
        }

        if (pages_num == 1) {
          //执行搜索获取结果
          self.setData({
            searchResult: data.data,
            searchHistory: search
          })
        } else {
          //分页
          self.setData({
            searchResult: [...self.data.searchResult, ...data.data],
            searchHistory: search
          })
        }
        //结果为空更改提示语
        if (data.count == 0) {
          self.setData({
            loadAll: true,
            noResult: true
          })
        }
      }
    })
  },

  //搜索答主
  getAnswerList() {
    const self = this
    const page = this.data.page
    const parms = {
      page: page,
      nickname: this.data.content
    }
    Master_list.create(parms).then(res => {
      if (res && res.result === 0) {
        console.log("ressssss",res)
        let that = this
        this.setData({
          master: res.data.master
        })

        let {
          data,
          count,
          pages
        } = res.data.list
        console.log('data', data)
        if (typeof (data) == 'undefined'||data==null) {
          that.setData({
            answerList: [],
            loadAll: true,
            noResult: true
          })
          return
        }
        if (pages == 1 || pages == page) {
          self.setData({
            loadAll: true
          })
        }

        //第一页
        if (page == 1) {
          self.setData({
            answerList: data
          })
        } else {
          //分页
          self.setData({
            answerList: [...self.data.answerList, ...data]
          })
        }
      //  type区别不同搜索, 1,搜索名片 4,搜索答主 5搜索问答

        if (self.data.type == 4 && self.answerList.length==0){
             self.setData({
              loadAll: true,
              noResult: true
             })
        }
        // console.log("无数据")
        // //结果为空更改提示语
        //   self.setData({
        //     loadAll: true,
        //     noResult: true
        //   })


      }

    })
  },

  //搜问答
  searchQuestion: util.debounce(function (keyWord) {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this
    util.request({
      url: config.apiUrl + '/hr/group/question/grp_search',
      method: "POST",
      withSessionKey: true,
      data: {
        keyword: keyWord,
        page: that.data.page,
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result == 0) {
 
        let {
          data,
          pages
        } = res.data
        console.log('data', res.data.data)
        if (typeof(data) == 'undefined') {
          that.setData({
            qaList: [],
            loadAll: true,
            noResult: true
          })
          return
        }
        let page = that.data.page
        if (pages == 1 || pages == page) {
          that.setData({
            loadAll: true
          })
        }
        //第一页
        if (page == 1) {
          that.setData({
            qaList: data
          })
        } else {
          //分页
          that.setData({
            qaList: [...that.data.qaList, ...data]
          })
        }
        if (that.data.qaList.length == 0) {
          that.setData({
            qaList: [],
            loadAll: true,
            noResult: true
          })
          return
        }
        
        console.log('qaList',this.data.qaList)
            that.data.qaList.forEach(ele => {
              ele.isPlay = false //是否播放音频标识
            })
            that.setData({
              qaList: that.data.qaList
            })
        // }else{
        //   console.log("m没有数据")
        //   this.setData({
        //     loadAll: true,
        //     noResult: true,
        //     qaList:[]
        //   })
        // }
      }else{
        console.log('res',res)
      }
    })
  }, 500),




  //搜索框中的清除按钮
  clear() {
    this.setData({
      content: '',
      searchResult: [],
      page: 1,
      loadAll: false,
      noResult: false,
      qaList:[],
      answerList:[]
    })
  },
  //删除搜索历史
  _delSearch() {
    wx.showModal({
      title: '提示',
      content: '是否清除搜索历史',
      success: res => {
        if (res.confirm) {
          let {
            type
          } = self.data
          let prams = {
            type: type
          }
          DelSearch.find(prams).then(res => {
            if (res && res.result === 0) {
              this.setData({
                searchHistory: []
              })
            }
          })
        }
      }
    })
  },

  //上拉加载更多
  onReachBottom: function () {
    let {
      loadAll,
      page
    } = self.data
    if (!loadAll) {
      self.setData({
        page: ++page
      })
      //  type区别不同搜索, 1,搜索名片 4,搜索答主 5搜索问答
      if(this.data.type==1){
        self.getCardList(self.data.content,self.data.page)
      }else if(this.data.type==4){
        self.getAnswerList()
      }else if(this.data.type==5){
          self.getSearchResult()
      }
    }else{
      wx.showToast({
        title: '已加载全部',
      })
    }
  },
  //点击搜索历史搜索
  searchItem(e) {
    let { item } = e.currentTarget.dataset;
    self.setData({
      content: item,
      delete: true
    })
    self.getSearchResult()
  }
})