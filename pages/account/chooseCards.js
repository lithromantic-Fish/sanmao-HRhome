const app = getApp()

const {
  GetGroupPeople,
  AddGroupPeople,
  SaveFormID,
  // ContactAddGroupList,
  // MyCardcase,
  // NoGroup
} = require('../../utils/Class')

let groupId
let cards = []
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
]
let self = {}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    groups: [],
    newNum: 0,
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    // 导航字母
    letters: letters,
    empty: false,
    content: '',
    searchList: [],
    current: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    groupId = options.id

    self.getData()
  },
  //获取数据
  getData() {
    let { content } = self.data
    GetGroupPeople.find({
      nickname: content,
      group_id: groupId
    }).then(res => {
      console.info(res)
      if (res && res.result === 0) {
        let {
          data,
          empty
        } = res.data
        self.setData({
          groups: data
        })
        
        if (Object.keys(data).length == 0) {
          empty = true
        } else {
          empty = false
        }
        self.setData({
          empty: empty
        })
      }
    })
    // 设备信息
    const res = wx.getSystemInfoSync()
    const windowHeight = res.windowHeight
    // to do 应获取完数据才进行此操作

    // 第一个字母距离顶部高度，单位使用的是rpx,须除以pixelRatio，才能与touch事件中的数值相加减，css中定义nav高度为94%，所以 *0.94
    const navHeight = windowHeight * 0.94, // 
      eachLetterHeight = navHeight / 26,
      comTop = (windowHeight - navHeight) / 2,
      temp = [];
    this.setData({

      eachLetterHeight: eachLetterHeight,
      windowHeight: windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });

    // 求各字母距离设备左上角所处位置

    for (let i = 0, len = letters.length; i < len; i++) {
      const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
        y = comTop + (i * eachLetterHeight);
      temp.push([x, y]);
    }
    this.setData({
      lettersPosition: temp
    })
  },

  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })

    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        selected: 0
      })
    }, 500);
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
      y = e.touches[0].clientY,
      lettersPosition = this.data.lettersPosition,
      eachLetterHeight = this.data.eachLetterHeight,
      letters = this.data.letters;
    console.log(y);
    // 判断触摸点是否在字母导航栏上
    if (x >= lettersPosition[0][0]) {
      for (let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
          __y = _y + eachLetterHeight; // 单个字母最大高度取值范围， 50为字母高50rpx
        if (y >= _y && y <= __y) {
          this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
  touchend(e) {
    this.cleanAcitvedStatus();
  },
  // 搜索输入框
  getText(e) {
    // debug.log(e)
    if (e.detail.value) {
      this.setData({
        delete: true,
        content: e.detail.value
      })
    } else {
      this.setData({
        content: e.detail.value
      })
    }
    self.getData()
  },
  clear() {
    this.setData({
      content: '',
      delete: false
    })
    self.getData()
  },
  searchMt() {
    searchList = []
    let content = this.data.content
    if (content == '') {
      searchList = []
      this.setData({
        search: false,
        searchList: searchList
      })
    } else {
      for (let i = 0; i < cards.length; i++) {
        let str = cards[i].BusName
        if (str.indexOf(content) > -1) {
          // debug.log(cards[i])
          searchList.push(cards[i])
        }
      }
      this.setData({
        search: true,
        searchList: searchList
      })
    }
  },
  changeRadio({
    detail = {}
  }) {
    const index = this.data.current.indexOf(detail.value);

    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
  },
  submit(e) {
    // console.log(this.data.current)
    let choodesCards = this.data.current.join(',')
    let {
      formId,
      target
    } = e.detail

    let prams = {
      group_id: groupId,
      idlist: choodesCards,
      showLoading: true

    }

    SaveFormID.find({
      formId: formId
    })

    //取消按钮 返回上一页
    let { back } = target.dataset
    if (back) {
      wx.navigateBack()
      return
    }
    //确定按钮 提交数据
    // 选择数据为空
    if (!prams.idlist) {
      wx.showToast({
        title: '没有选择名片',
        icon: 'none',
        duration: 2000
      })
      return
    }
    //有选择的数据
    AddGroupPeople.create(prams).then(res => {
      // debug.log(res)
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    })
  }

})