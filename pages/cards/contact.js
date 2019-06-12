// const {groupDetail} = require('../../mock/index.js')
let card 
let client_id
let socket
let now
let list= []
let shield = 0
const app = getApp()
const debug = require('../../utils/debug')
const moment = require('../../vendors/moment.min.js')
const {Shield,ChatGroup,CardDetail,History,SaveHistory,UpShield,Ishie} = require('../../utils/Class')
    // 心跳对象
let heartCheck = {
  timeout: 10000, 
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setTimeout(()=> {
    console.log("发送ping");
    let send_data = {
      client_id:client_id,
      type:'ping',
      MOpenId:app.globalData.openid
    } 
    debug.log('发送的信息===', send_data )
    socket.send({
      data:JSON.stringify( send_data ),
      success: res => {
        console.log('发送消息', res)
      }
    })
    this.serverTimeoutObj = setTimeout(() =>{
      socket.close(res=>{
        console.log('关闭此socket',res)
        
      })
    }, this.timeout);
    }, this.timeout);
  }
  };

Page({


  data: {
    // card: groupDetail[0],
    scrollTop:null,
    list
  },

  onLoad: function (options) {
    // const that  = this 
    shield = 0
    now = moment()
    list= []
    client_id = null
    this.setData({
      openid:app.globalData.openid
    })
   const data = {
    BusId:options.BusId,
    "OpenId": app.globalData.openid,
    "YOpenId": options.openid,
  }
  CardDetail.create(data).then(_res=>{
    debug.log(_res.list)
    card = _res.list
    this.setData({
      card
    })
    wx.setNavigationBarTitle({
      title: card.BusName
    })
    this.getHistory()
    this.linkSocket()
    this.Ishie()
  })
  // to do
  
  },
  Ishie(){
    return Ishie.get(`${card.OpenId}/${app.globalData.card.BusId}`).then(res=>{
      // to do
      debug.log('判断自己是否被他人屏蔽',res.list)
      if(res.list===0){
        console.log('没有屏蔽我')
        shield = 0
      }else{
        console.log('屏蔽了我')
        shield=1
      }
      debug.log(res.list)
    })
  },
  getHistory(){
    History.get(`${app.globalData.openid}/${card.OpenId}`).then(res=>{
      debug.log('历史记录',res)
      let array= res.message.map(item=>{
        if(item.MOpenId===app.globalData.openid){
          return Object.assign(item,app.globalData.card)
        }else{
          return  Object.assign(item,card)
        }
      })
      list = list.concat(array)
      if(card.Shield===1){//在最后加上是否屏蔽对方
        list.push({type:'shield'})
      }
      this.setData({
        list
      })
      const that = this
      wx.createSelectorQuery().select('#content').fields({
       dataset: true,
       size: true,
       scrollOffset: true,
       properties: ['scrollX', 'scrollY']
     },res=>{
       that.setData({
         scrollTop:res.height+500
       })
     }).exec()
    })
  },
 
  initEventHandle(){
    let that = this
    socket.onMessage(res=> {
    console.log('服务器返回数据',res)
    const data = JSON.parse(res.data)
    client_id = data.client_id
     if (data.type === "pong"){
      heartCheck.reset().start()
     }
     else{
      if(data.type === 'shield'){//说明自己被人屏蔽了
        console.log('别人屏蔽了我')
        shield = 1
       }
       if(data.type === 'upshield'){//说明自己被人取消屏蔽了
        console.log('别人取消屏蔽了我')
        shield = 0
       }
      if(data.type==='init'){
        const send_data = {
          client_id:client_id,
          type:'bind',
          MOpenId:app.globalData.openid
        } 
        this.send(send_data)
      }
      if(data.type==='save' || data.type==='text'){//save只是发送出去显示在页面，text是显示并保存
        if(data.type==='text' && card.Shield===1){
          return 
        }
        debug.log('判断别人是否屏蔽我==',shield)
        if(shield === 1){
          wx.showToast({
            title:'发送失败',
            icon:'none',
            duration:2000
          })
          return
        }
        if(list.length>0){
          const time = moment((list[list.length-1].time)*1000)
          const duration = moment(data.time*1000).diff(time,'minutes')
          console.log('duration======',time,moment(data.time*1000),duration)
          if(duration>1){
            list.push({type:'time',time:moment(data.time*1000).format('HH:mm')})
          }
        }
         //相差一分钟显示时间？
        if(data.MOpenId===app.globalData.openid){
          Object.assign(data,app.globalData.card)
          list.push(data)
        }else if(data.YOpenId===app.globalData.openid){
         Object.assign(data,card)
         list.push(data)
        }
        this.setData({
          list
        })
        wx.createSelectorQuery().select('#content').fields({
         dataset: true,
         size: true,
         scrollOffset: true,
         properties: ['scrollX', 'scrollY']
       },res=>{
         console.log('res.height',res.height)
         that.setData({
           scrollTop:res.height+500
         })
       }).exec() 
       if(data.type==='save') {
         const message = {
          "MOpenId":app.globalData.openid,
          "MName":app.globalData.card.BusName,
          "YOpenId":data.YOpenId,
          "YName":card.BusName,
          "data":data.data,
          "time":data.time,
          "shield":shield
         }
        SaveHistory.create(message).then(res=>{
          debug.log('保存成功')
        })
       } 
     }

     }
    })
    socket.onOpen(res=>{
      console.log('WebSocket连接已打开',res)
      heartCheck.reset().start()
    })
    socket.onClose(res=>{
      console.log('WebSocket连接已关闭',res)
      this.reconnect()
    })
    socket.onError(res=>{
      console.log('WebSocket连接打开失败',res)
      this.reconnect()
    })
   },
   linkSocket(){
    let that = this
    socket =  wx.connectSocket({
      url: app.globalData.wssUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        },
      success: function (res) {
        console.log('连接成功',res);
      }
    });
    this.initEventHandle()
   },
   reconnect(){
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    clearTimeout(this.timer)
    if (this.data.limit<12){
     this.timer = setTimeout(() => {
      this.linkSocket();
      this.lockReconnect = false;
     }, 5000);
     this.setData({
      limit: this.data.limit+1
     })
    }
   },
  send(data){
    debug.log('发送的信息===',data)
    socket.send({
      data:JSON.stringify(data),
      success: res => {
        console.log('发送消息', res)
      }
    })
  },
  pb(){
    const id = app.globalData.openid + '/' + card.BusId
    const str = 'card.Shield'
    const that = this
    if( card.Shield ===0){
      Shield.get(id).then(res=>{
        wx.showToast({
          title:'屏蔽成功',
          icon:'success',
          duration:2000
        })
        card.Shield = 1
        list.push({type:'shield'})
        const data = {//发送屏蔽的消息
          client_id,
          "type":"shield",
          "MOpenId":app.globalData.openid,
          "YOpenId":card.OpenId
        }
        this.send(data)
        this.setData({
          [str]:1,
          list
        })
        wx.createSelectorQuery().select('#content').fields({
          dataset: true,
          size: true,
          scrollOffset: true,
          properties: ['scrollX', 'scrollY']
        },res=>{
          that.setData({
            scrollTop:res.height+500
          })
        }).exec()
      })
    }else{
      UpShield.get(id).then(res=>{
        wx.showToast({
          title:'取消成功',
          icon:'success',
          duration:2000
        })
        const data = {//发送取消屏蔽的消息
          client_id,
          "type":"upshield",
          "MOpenId":app.globalData.openid,
          "YOpenId":card.OpenId
        }
        this.send(data)
        card.Shield = 0
        list.push({type:'upshield'})
        this.setData({
          [str]:0,
          list
        })
        wx.createSelectorQuery().select('#content').fields({
          dataset: true,
          size: true,
          scrollOffset: true,
          properties: ['scrollX', 'scrollY']
        },res=>{
          that.setData({
            scrollTop:res.height+500
          })
        }).exec()
      })
    }
    
  },
  call(){
    wx.makePhoneCall({
      phoneNumber: card.BusTel,
    })
  },
  changebottom(){
    this.setData({
      bottom:20
    })
  },
  dowbbottom(){
    this.setData({
      bottom:0
    })
  },
  getContent(e){
    this.setData({
      content:e.detail.value
    })
  },
  sendMessage(e){
    if(card.Shield===1){
      wx.showToast({
        title:'您已屏蔽对方',
        icon:'none',
        duration:2000
      })
      return
    }
    const data = {
      client_id,
      data:this.data.content,
      "type":"say",
      "MOpenId":app.globalData.openid,
      "YOpenId":card.OpenId,
      "shield":shield
    }
    this.setData({
      content:''
    })
    this.send(data)
  },
  onHide: function () {
    debug.log('页面隐藏事件')
    // heartCheck.reset()
    // socket.close(res=>{
    //   console.log('关闭此socket',res)
    // })
  },

  onUnload: function () {
    debug.log('页面卸载事件')
    heartCheck.reset()
    socket.close(res=>{
      console.log('关闭此socket',res)
    })
  },
})