const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

 function selectDay(begintime,endtime) {
  var nTime = endtime - begintime;
  var day = Math.floor(nTime / 86400);
  return day;
}

function deepGet(obj, key, defaultValue) {
  if (!obj) return defaultValue
  if (!key) return obj
  const result = key
    .split('.')
    .reduce(
      (it, key) => (it && typeof it === 'object' ? it[key] : defaultValue),
      obj
    )
  return result
}

function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
        hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
        hs == 0x2b50) {
        return true;
      }
    }
  }
}
/**函数的去抖动**/
function Debounce(method, delay) {
  let timer = null
  let _delay = delay ? delay : 500
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(context, args);
      console.info(method, context, args)
    }, _delay)
  }
}
/**函数节流**/
function Throttle(method, duration) {
  let begin = new Date();
  let _duration = duration ? duration : 500
  return function () {
    let context = this,
      args = arguments,
      current = new Date();
    if (current - begin >= _duration) {
      method.apply(context, args);
      begin = current;
    }
  }
}


module.exports = {
  formatTime,
  deepGet,
  isEmojiCharacter,
  selectDay,
  Debounce: Debounce,
  Throttle: Throttle,
}