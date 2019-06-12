//倒计时组件
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    endAt: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeObj: {},
  },
  ready() {
    this.countDown(this.data.endAt)
  },

  methods: {
    timeFormat(param) {    //小于10的格式化函数
      return param < 10 ? '0' + param : param
    },
    //倒计时
    countDown(endAt) {
      let newTime = new Date().getTime()
      let endTime = new Date(endAt).getTime() //手机解析不了2018-11-01 24:00这种格式！！
      let time = (endTime - newTime) / 1000
      this.init(time)
      let timer = setInterval(() => {
        time --
        if (time > 0) {
          this.init(time)
        } else {
          clearInterval(timer)
          this.triggerEvent("stopCountDown")  
        }
      }, 1000)
    },
    init(time) {
      // let endTime = new Date(2018,10,2,24,0,0).getTime();
      let obj = null
      if (time > 0) {
        // 获取天、时、分、秒
        // let day = parseInt(time / (60 * 60 * 24))
        // let hou = parseInt(time % (60 * 60 * 24) / 3600)
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
        obj = {
          // day: day < 10 ? '0'+day : day,
          // hou: hou < 10 ? '0'+hou : hou,
          min: min < 10 ? '0'+min : min,
          sec: sec < 10 ? '0'+sec : sec
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          // day: '00',
          // hou: '00',
          min: '00',
          sec: '00'
        }
      }
      this.setData({ timeObj: obj })
    }
  }
})
