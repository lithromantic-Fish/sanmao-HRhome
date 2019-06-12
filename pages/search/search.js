const app = getApp();
const {
  Card,
  DelSearch,
  ActivityList,
  HotActivity
} = require('../../utils/Class.js')
const {
  Debounce
} = require('../../utils/util.js')

const placeholderTxt = ['搜索姓名/公司/职务', '搜索活动名称']
const searchResultNullTxt = ['请搜索姓名/公司/职务', '请搜索活动名称']

let self = {}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 1, //type区别不同搜索, 1,搜索名片 2,搜索活动
    placeholder: '请输入搜索内容', //搜索框默认提示语
    searchResultNullTxt: '', //搜索无结果提示语
    content: '', //输入框输入内容
    searchResult: [], //搜索结果
    searchHistory: [], //搜索历史
    loadAll: false, //是否加载了全部
    page: 1 //分页默认page
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this

    let {
      type
    } = options
    let _placeholder = ''
    let _searchResultNullTxt = ''

    self.setData({
      type: type
    })

    //type区别不同搜索, 1,搜索名片, 2搜索活动
    switch (parseInt(type)) {
      case 1:
        _placeholder = placeholderTxt[0]
        _searchResultNullTxt = searchResultNullTxt[0]
        break;
      case 2:
        _placeholder = placeholderTxt[1]
        _searchResultNullTxt = searchResultNullTxt[1]
        break;
    }
    self.setData({
      placeholder: _placeholder,
      searchResultNullTxt: _searchResultNullTxt
    })

    self.getSearchResult()
  },
  //获取输入框信息
  getText(e) {
    let {
      value
    } = e.detail
    this.setData({
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

    if (loadAll) return

    let prams = {
      name: content,
      page: page
    }

    //搜索名片
    type == 1 && Card.find(prams).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages_num,
          search
        } = res.data

        if (!content) {
          //页面默认加载获取搜索历史记录
          self.setData({
            searchHistory: search
          })
        } else {

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
              searchResultNullTxt: '没有搜索到相关结果'
            })
          }
        }
      }
    })

    //搜索活动
    type == 2 && ActivityList.find(prams).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages,
          count,
          pages_num,
          search
        } = res.data

        if (!content) {
          //页面默认加载获取搜索历史记录
          self.setData({
            searchHistory: search
          })
        } else {

          //如果结果只有一页,或者当前page等于分页数 则是已经加载了全部
          if (pages == 1 || pages == page) {
            self.setData({
              loadAll: true
            })
          }

          console.info('data', data)

          if (pages == 1) {
            //执行搜索获取结果
            self.setData({
              searchResult: data,
              searchHistory: search
            })
          } else {
            //分页
            self.setData({
              searchResult: [...self.data.searchResult, ...data],
              searchHistory: search
            })
          }
          //结果为空更改提示语
          if (count == 0) {
            self.setData({
              loadAll: true,
              searchResultNullTxt: '没有搜索到相关结果'
            })
          }
        }
      }
    })
    // 搜索精品活动
    type == 3 && HotActivity.find(prams).then(res => {
      if (res && res.result === 0) {
        let {
          data,
          pages,
          count,
          pages_num,
          search
        } = res.data

        if (!content) {
          //页面默认加载获取搜索历史记录
          self.setData({
            searchHistory: search
          })
        } else {

          //如果结果只有一页,或者当前page等于分页数 则是已经加载了全部
          if (pages == 1 || pages == page) {
            self.setData({
              loadAll: true
            })
          }

          console.info('data', data)

          if (pages == 1) {
            //执行搜索获取结果
            self.setData({
              searchResult: data,
              searchHistory: search
            })
          } else {
            //分页
            self.setData({
              searchResult: [...self.data.searchResult, ...data],
              searchHistory: search
            })
          }
          //结果为空更改提示语
          if (count == 0) {
            self.setData({
              loadAll: true,
              searchResultNullTxt: '没有搜索到相关结果'
            })
          }
        }
      }
    })


  },
  //搜索框中的清除按钮
  clear() {
    this.setData({
      content: '',
      searchResult: [],
      page: 1,
      loadAll: false
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
  onReachBottom: function() {
    let {
      loadAll,
      page
    } = self.data
    if (!loadAll) {
      self.setData({
        page: ++page
      })
      self.getSearchResult()
    }
  },
  //点击搜索历史搜索
  searchItem(e) {
    let  {item} = e.currentTarget.dataset;
    self.setData({
      content: item,
      delete: true
    })
    self.getSearchResult()
  }
})