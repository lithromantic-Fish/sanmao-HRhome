const {
  MyCardsHolder, //我的名片夹列表

} = require('../../utils/Class.js')

const {
  Debounce
} = require('../../utils/util.js')

const app = getApp()

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
]

let self = {}

Page({
  data: {
    newNum: 0,
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    // 导航字母
    letters: letters,
    groups: [],
    content: '', //搜索内容
  },
  onLoad: function(options) {
    self = this
  },
  onShow() {
    // debug.log('onshow')
    this.getData()
  },
  //获取我的名片列表
  getData() {
    let {
      content
    } = self.data

    let prams = {
      nickname: content
    }

    MyCardsHolder.find(prams).then(res => {
      // console.info(res)
      if (res && res.result === 0) {
        let {
          my_card,
          red_point
        } = res.data

        self.setData({
          groups: my_card,
          newNum: parseInt(red_point)
        })

        //当前结果是否为空
        if (Object.keys(my_card).length == 0) {
          this.setData({
            empty: true
          })
        } else {
          this.setData({
            empty: false
          })
        }
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
  //右侧字母选择
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
  // 打电话
  call(e) {
    // phone=true
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })

    // wx.makePhoneCall({
    //   phoneNumber: e.currentTarget.dataset.phone,
    // })
  },
  //去对方名片详情页
  gotoDetail(e) {
    // if(phone){
    wx.navigateTo({
      url: '../cards/cardDetail?card_id=' + e.currentTarget.dataset.id,
    })
    // }
  },
  // 输入框
  getText(e) {
    // debug.log(e)
    let {
      value
    } = e.detail

    self.setData({
      content: value
    })

    if (value) {
      self.setData({
        delete: true
      })
    }
  },
  clear() {
    self.setData({
      content: '',
      delete: false
    })
    self.getData()
  },
  // searchMt() {
  //   searchList = []
  //   let content = this.data.content
  //   if (content == '') {
  //     searchList = []
  //     this.setData({
  //       search: false,
  //       searchList: searchList
  //     })
  //   } else {
  //     for (let i = 0; i < cards.length; i++) {
  //       let str = cards[i].BusName
  //       if (str.indexOf(content) > -1) {
  //         // debug.log(cards[i])
  //         searchList.push(cards[i])
  //       }
  //     }
  //     this.setData({
  //       search: true,
  //       searchList: searchList
  //     })
  //   }
  // },
  // addNew(card){
  //   this.getData()
  //   // this.onLoad
  // //   groups = [
  // //     {
  // //       groupName: 'A',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'B',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'C',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'D',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'E',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'F',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'G',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'H',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'I',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'J',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'K',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'L',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'M',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'N',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'O',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'P',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'Q',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'R',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'S',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'T',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'U',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'V',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'W',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'X',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'Y',
  // //       users: []
  // //     },
  // //     {
  // //       groupName: 'Z',
  // //       users: []
  // //     }
  // //   ]
  //   debug.log(groups)
  //   debug.log('groups===', groups)
  // //   const openid = app.globalData.openid
  // //   // todo 
  // //   MyCardcase.get(openid).then(res => {
  //     debug.log(res)
  // //     cards = res.list

  // //     if (res.list.length === 0) {
  // //       this.setData({ empty: true })
  // //     }
  // //     cards.forEach(item => {
  // //       let str = item.BusPinyin
  // //       let letter = str.substring(0, 1).toUpperCase()
  //       debug.log(letter)
  // //       for (let i = 0; i < groups.length; i++) {
  // //         if (groups[i].groupName == letter) {
  // //           groups[i].users.push(item)
  // //           break
  // //         }
  // //       }
  // //     })
  // //     this.setData({ groups })
  // //     Newapp.get(openid).then(res => {
  //       debug.log(res)
  // //       this.setData({
  // //         newNum: res.list.length
  // //       })
  // //     })
  // //   })
  // }
})