//网络请求封装
// const debug = require('./debug.js')
const util = require('./util.js')
const app = getApp()
const constant = require('./constant.js')
const {
  Login,
} = require('Class.js')
const HOST = "https://www.hrloo.com"
// const HOST = "http://www.chengp.top"

function getHeader(params) {
  const app = getApp()
  // const header = {
  //   'Content-Type': 'application/json;',
  //   'Cache-control': 'no-cache'
  // }
  const header = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cache-control': 'no-cache'
  }
  return Object.assign(header, params.header)
}

function getUrl(url, params) {
  const {
    query,
    host
  } = params
  if (query) {
    url = [url, getQueryString(query)].join('?')
  }
  return /^https?:\/\//.test(url) ? url : (host || HOST + url)
}

function getQueryString(query) {
  const keys = Object.keys(query),
    queryStringArr = []
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i],
      value = query[key]
    if (value && typeof value === 'object') {
      const subKeys = Object.keys(value)
      for (let j = 0, sLen = subKeys.length; j < sLen; j++) {
        const subKey = subKeys[j],
          subValue = value[subKey]
        const k = encodeURIComponent(`${key}[${subKey}]`)
        const v = encodeURIComponent(subValue)
        queryStringArr.push(`${k}=${v}`)
      }
    } else {
      const k = encodeURIComponent(key)
      const v = encodeURIComponent(query[key])
      queryStringArr.push(`${k}=${v}`)
    }
  }
  return queryStringArr.join('&')
}

/**
 * 返回参数对形式的对象
 * @param url 地址
 */
function parseQueryString(url) {
  let arr
  let res = {}
  url = url.split('#')[0]
  arr = url.split('?')
  arr.shift()
  let queryStr = arr.join('?')
  //查询字符串为空直接返回 避免出现这样的返回值{"":""}
  if (queryStr.trim().length === 0) {
    return res
  }

  //获取参数
  arr = queryStr.split('&')
  for (let i = 0; i < arr.length; i++) {
    let itemArr = arr[i].split('=')
    //第一个=号之前的是name 后面的全是值
    let name = itemArr.shift()
    res[name] = decodeURIComponent(itemArr.join('='))
  }
  return res
}


// 999  调用login.login
// 100  调用autoRegister
function get(url, params = {}, recall) {
  params.hrhome_token = wx.getStorageSync('hrhome_token') || ''
  params.session_key = wx.getStorageSync('hrhome_token') || ''
  params.mintype = 5
  params.is_mina = 1

  return new Promise((resolve, reject) => {
    if (params.showLoading) {
      wx.showLoading()
    }
    wx.request({
      url: getUrl(url, params),
      method: 'GET',
      data: params,
      header: getHeader(params),
      success: function(res) {
        console.log('res',res)
        if (res.data.result == 999 || res.data.result == 100 ) {

          // wx.showModal({
          //   title: '提示',
          //   content: '登录过期，请重新登录',
          //   success(res) {
          //     if (res.confirm) {
          //       wx.navigateTo({
          //         url: '/pages/login/login',
          //       })
          //       console.log('用户点击确定')
          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //     }
          //   }
          // })
          // console.log("get等于999了，token过期返回expired为true")
          // let userinfo = wx.getStorageSync('userInfo')

            // wx.setStorageSync('expired', true)
            // console.log("userinfo", userinfo)
        }

        //  else if (res.data.result == 100){
        //   console.log("http检测没有登录")
        //   wx.setStorageSync('isLogin', false)
        // }
        resolve(wrap(res, params))

        // debug.log(res)
      },
      fail: function(err) {
        reject(err)
        // debug.log(err)
      },
       complete() {
         if (params.showLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}

// 999  调用login.login
// 100  调用autoRegister
function post(url, data, params = {}) {
  // debug.log('url',url)
  // debug.log('params', params)
  // debug.log('data333', data)
  let _data = data || {};
  
  // console.info(typeof (_data))
  Object.assign(_data, {
    'hrhome_token': wx.getStorageSync('hrhome_token') || '',
     session_key :wx.getStorageSync('hrhome_token') || '',
     mintype : 5,
     is_mina : 1
  
  });
  // data.hrhome_token = wx.getStorageSync('hrhome_token') || ''
  return new Promise((resolve, reject) => {
    if (_data.showLoading){
      wx.showLoading()
    }
    console.log("params",params)
    console.log("_data",_data)
    wx.request({
      url: getUrl(url, params),
      method: 'POST',
      data: _data,
      header: getHeader(params),
      success: function(res) {
        console.log('res',res)
        if (res.data.result == 999){
          // console.log("post等于999了，token过期返回expired为true")
          // let userinfo = wx.getStorageSync('userInfo')
          // console.log("userInfo",userinfo)
          // wx.setStorageSync('expired',true)
        }
        //  else if (res.data.result == 100) {
        //   console.log("http检测没有登录")
        //   wx.setStorageSync('isLogin', false)
        // }
        resolve(wrap(res, params))
        // debug.log('res', res)
      },
      fail: function(err) {
        reject(err)
        // debug.log(err)
      },
      complete() {
        if (_data.showLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}

function put(url, data, params = {}) {
  //debug.log(url, data, params)
  return new Promise((resolve, reject) => {
    data.hrhome_token = wx.getStorageSync('hrhome_token') || ''
    wx.request({
      url: getUrl(url, params),
      method: 'PUT',
      data,
      header: getHeader(params),
      success: function(res) {
        resolve(wrap(res, params))
        // debug.log(res)
      },
      fail: function(err) {
        reject(err)
        // debug.log(err)
      }
    })
  })
}

function remove(url, params = {}) {
  return new Promise((resolve, reject) => {
    data.hrhome_token = wx.getStorageSync('hrhome_token') || ''
    wx.request({
      url: getUrl(url, params),
      method: 'DELETE',
      header: getHeader(params),
      success: function(res) {
        resolve(wrap(res, params))
        // debug.log(res)
      },
      fail: function(err) {
        reject(err)
        // debug.log(err)
      }
    })
  })
}

/**
 * 请求结果特殊服务状态处理
 */
function wrap(res, params) {
  const status = res.statusCode
  if (status >= 200 && status < 300) {
    res.ok = true
  } else if (status >= 400 && status < 500) {
    if (status === 401) {
      wx.redirectTo({
        url: '/pages/account/myClub'
      })
    } else {
      if (!params.hideModal) {
        wx.showModal({
          title: '请求失败',
          content: util.deepGet(res, 'data.message', constant.ERROR.REQUEST_FAILED),
          showCancel: false
        })
      }
    }
  } else if (status >= 500 && status < 600) {
    if (!params.hideToast) {
      wx.showToast({
        title: '服务器异常',
        icon: 'none',
        duration: 3000
      })
    }
  }
  return res
};

// async function getProcessListLoading() {

//   var startTime = 0;
//   var endTime = 0;
//   const timeoutDuration = 250; // 250ms内如果接口还没返回就显示loading
//   var isApiTransient = false; // api请求时间小于timeoutDuration
//   var timer;

//   timer && clearTimeout(timer);
//   // debugger;
//   timer = setTimeout(() => { // timer 为数值 （真值）
//     if (endTime - startTime < timeoutDuration) {
//       if (!isApiTransient) {
//         // 这个会导致页面闪烁(空页提示会出现)
//         // state.tableData = []; // 清空下数据
//         // commit('setAppState', {
//         //   key: "loading",
//         //   val: {
//         //     loadingTable: true
//         //   }
//         // });
//       }
//     }
//   }, timeoutDuration);
//   startTime = +new Date();
//   await dispatch('getProcessResumeList'); // 等待 getProcessResumeList 完成
//   endTime = +new Date();

//   console.log('endTime - startTime', endTime - startTime);

//   // 如果请求 < 250ms  标志 isApiTransient为true 关闭loading 不再进settimeout
//   // 如果请求 > 250ms  标志 isApiTransient 为false 进 settimeout
//   if (endTime - startTime < timeoutDuration) {
//     isApiTransient = true;
//     // commit('setAppState', {
//     //   key: "loading",
//     //   val: {
//     //     loadingTable: false
//     //   }
//     // });
//   } else {
//     isApiTransient = false;
//   }
// };

module.exports = {
  get,
  post,
  put,
  remove,
  getQueryString,
  parseQueryString
}