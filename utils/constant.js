//常量
const ERROR = {
    REQUEST_FAILED: '服务器拒绝了您的请求！',
    SERVER_EXCEPTION: '系统出现异常，请稍后再试！'
}
const ACTIVITY_STATUS = {//活动状态
    "0":"未开始",
    "1":"进行中",
    "2":"已结束",
    "3":"去签到",
}
const ACTIVITY_CHECK = {//活动状态
    "0":"审核中",
    "1":"审核通过",
    "2":"未通过",
}
const RELEASE_STATUS = {//活动发布状态
    "0":"未发布",
    "1":"已发布",
    "2":"已下线",
}
const PUBLIC = {//是否公开
    "0":"否",
    "1":"是",
}
const BUS_STATUS = {//申请状态
    "0":"未申请",
    "1":"申请中",
    "2":"已通过",
    "3":"未通过",
}
const SWOP_STATUS = {//交换名片状态
    "0":"未同意",
    "1":"已同意",
    "2":"申请中",
    "3":"未申请"
}
const ORDER_STATUS = {//交换名片状态
  "0": "未支付",
  "1": "超时",
  "2": "支付成功",
}
const POPULARITY = {//人气值说明
  "0": "生成名片",
  "1": "交换名片成功",
  "2": "邀请别人注册名片",
  "3": "名片加V",
  "4": "报名活动",
  "5": "活动现场签到",
  "6": "活动点赞",
  "7": "活动评论",
}
const Rank = {//人气值头衔
  "0": "小白",
  "1": "新秀",
  "2": "高手",
  "3": "大侠",
  "4": "大神",
  "5": "大仙",
  "6": "至尊",
}


module.exports = {
    ERROR,
    ACTIVITY_STATUS,
    RELEASE_STATUS,
    PUBLIC,
    BUS_STATUS,
    SWOP_STATUS,
    POPULARITY,
    Rank,
    ACTIVITY_CHECK

}