//获取用户地理位置
const QQMapWX = require('../vendors/qqmap-wx-jssdk.min.js')
const debug = require('../utils/debug.js')
var qqmapsdk = new QQMapWX({
  key: 'FI7BZ-D33R5-TL5IO-QQVRH-VV672-ZWF6I'
});

function getLocation(successCallBack, callBack) {
 const _this = this
  let userLocation = null;
  debug.log('获取位置')
  wx.getLocation({
    type: 'wgs84',
    success:  function (res) {
      userLocation = [res.longitude, res.latitude]
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (data) {
          const { ad_info } = data.result
          let selectedCityInfo = {
            cityCode: ad_info.city_code.substr(3),
            city: ad_info.city,
            district: ad_info.district,
            districtCode: ad_info.adcode,
            location: userLocation
          }
          debug.log('用户位置====',selectedCityInfo)
          successCallBack(selectedCityInfo)

          wx.setStorageSync('sky', selectedCityInfo.city)  //存储定位地址
          console.log('aaaaa',wx.getStorageSync('sky'))
        },
      })
      return 
    },
    complete: function (res) {
      if (userLocation){
        return 
      }else{
        callBack()
        // return
      } 
    },
    fail: function (res) {
      console.log(123)
    }
  })
}

function getLocationData(name,callBack){
  qqmapsdk.geocoder({
    address: name,
    success: res => {
      debug.log('qqmap=====', res)
      callBack(res)
    }
  })
}
module.exports = {
    getLocation,
    getLocationData
}