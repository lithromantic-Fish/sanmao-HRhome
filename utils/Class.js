//接口列表
const util = require('./util.js')
const http = require('./http.js')

class Feathers {
  constructor(url, options) {
    this.url = url
    this.options = options
  }

  filter(res) {
    if (res.ok) {
      return res.data
    } else {
      throw res
    }
  }
  find(params) {
    return http.get(`/${this.url}`, params).then(this.filter)
  }

  get(id, params) {
    return http.get(`/${this.url}/${id}`, params).then(this.filter)
  }

  create(data, params) {
    return http.post(`/${this.url}`, data, params).then(this.filter)
  }

  patch(id, data, params) {
    return http.put(`/${this.url}/${id}`, data, params).then(this.filter)
  }

  remove(id, params) {
    return http.remove(`/${this.url}/${id}`, params).then(this.filter)
  }
}

const Card = new Feathers('hr/hrhome/hrcard/card_list') // 名片广场
const CardDetail = new Feathers('hr/hrhome/hrcard/card_info') // 名片详情
const GetMobile = new Feathers('hr/hrhome/hrcard/get_mobile') //通过用户授权的参数获取编译后的手机号码 
const ChangeCard = new Feathers('hr/hrhome/hrcard/card_change_apply') //名片交换申请
const MyCard = new Feathers('hr/hrhome/hrcard/card_make') // 获取或者修改 我的名片信息
const MyCardDetail = new Feathers('hr/hrhome/hrcard/my_info') // 我的名片详细信息
const SaveFormID = new Feathers('hr/hrhome/hractivity/save_formid_cache') // 获取保存用户formid
const Report = new Feathers('hr/hrhome/hrcard/report') // 举报
const DeleteCard = new Feathers('hr/hrhome/hrcard/del_card') //删除交换的名片
const FavCard = new Feathers('hr/hrhome/hrcard/fav_ajax') //收藏名片
const DelSearch = new Feathers('hr/hrhome/hractivity/del_search') //删除搜索记录 参数type 名片-1  活动-2
const ViewList = new Feathers('hr/hrhome/hrcard/view_list')// 我看了谁/谁看了我 1,谁看我 2,我看谁
const FavList = new Feathers('hr/hrhome/hrcard/fav_list')// 谁收藏我/我收藏了谁 1,谁收藏我 2,我收藏谁
const ZanList = new Feathers('hr/hrhome/hrcard/zan_list')// 谁赞了我/我赞了了谁 1,赞了我谁 2,我赞了谁
const BannerList = new Feathers('hr/hrhome/hractivity/banner')// 活动banner图数据
const ActivityList = new Feathers('hr/hrhome/hractivity/activity_list')// 活动数据列表
const ActivityDetailData = new Feathers('hr/hrhome/hractivity/activity')// 活动内页数据
const ActivityImgs = new Feathers('hr/hrhome/hractivity/activity_imgs')// 活动内页云相册
const FavActivity = new Feathers('hr/hrhome/hractivity/collect')// 活动收藏
const ZanActivity = new Feathers('hr/hrhome/hractivity/zan')// 给活动点赞
const GetActivityPL = new Feathers('hr/hrhome/hractivity/pl_list')// 获取活动评论列表
const AddActivityPL = new Feathers('hr/hrhome/hractivity/ajax_pl')//活动提交评论
const DelActivityPL = new Feathers('hr/hrhome/hractivity/del_pl')//活动提交评论
const MyActivity = new Feathers('hr/hrhome/hractivity/my_activity')//我的活动 type 1我参与的  2我发起的  3我收藏的
const GetPageUrl = new Feathers('hr/hrhome/hrcard/get_scene')//根据scence获取page路径
const CheckApply = new Feathers('hr/hrhome/hractivity/check_apply')//检测是否可以报名
const Apply = new Feathers('hr/hrhome/hractivity/apply') //活动提交支付
const CancelApply = new Feathers('hr/hrhome/hractivity/cancel_apply') //取消活动报名
const AddActivity = new Feathers('hr/hrhome/hractivity/create_activity') //创建编辑活动
const HotActivity = new Feathers('hr/hrhome/hractivity/hot_activity') //精选活动
const ActivityQbcode = new Feathers('hr/hrhome/hractivity/activity_qbcode') //活动小程序码
const ApplyList = new Feathers('hr/hrhome/hractivity/apply_list') // 活动用户报名列表
const ApplyDetail = new Feathers('hr/hrhome/hractivity/apply_detail') //活动用户申请详情
const SignImg = new Feathers('hr/hrhome/hractivity/sign_qbcode') //活动签到二维码
const DetailContext = new Feathers('hr/hrhome/hractivity/activity_desc') //活动详情文字

const CardImg = new Feathers('hr/hrhome/hrcard/card_img') // 本人名片码
const NotifyList = new Feathers('hr/hrhome/hrcard/notify_list') // 系统消息列表
const DelNotify = new Feathers('hr/hrhome/hrcard/notify_delete') // 删除系统消息
const MyCardsHolder = new Feathers('hr/hrhome/hrcard/my_card') //我的名片夹列表
const MyCardRequst = new Feathers('hr/hrhome/hrcard/new_card') //我的交换名片申请
const CardAgree = new Feathers('hr/hrhome/hrcard/card_agree') //同意申请交换名片 当前名片id
const GroupList = new Feathers('hr/hrhome/hrcard/group_list') // 分组列表页面的分组列表接口
const CreateGroup = new Feathers('hr/hrhome/hrcard/create_group') //创建分组 name分组名称
const EditGroup = new Feathers('hr/hrhome/hrcard/group_update') //修改分组名称 name分组名称 分组group_id
const DelGroup = new Feathers('hr/hrhome/hrcard/dep_group') //删除分组 分组group_id
const GetGroupPeople = new Feathers('hr/hrhome/hrcard/card_list_new') //添加联系人时的 联系人列表 分组group_id
const AddGroupPeople = new Feathers('hr/hrhome/hrcard/add_group_member') //提交添加联系人接口 分组group_id idlist联系人数组[转,号连接字符串]
const GroupListById = new Feathers('hr/hrhome/hrcard/group_detail') // 分组详情页面的 当前分组下的人员列表
const DelGroupPeople = new Feathers('hr/hrhome/hrcard/dep_group_member') //删除分组下成员 联系人列表 分组group_id 成员member_id
const MyEvent = new Feathers('hr/hrhome/hractivity/my_event') //获取人气流水记录 status-0表示获取全部 1表示收到的 2代表获取支出
const VipStatus = new Feathers('hr/hrhome/hrcard/v_ajax') //申请加v dosubmit 为真则是提交 否则则是获取
const Remake = new Feathers('hr/hrhome/hrcard/remark') //名片添加备注信息
const ExportApplylist = new Feathers('hr/hrhome/hractivity/export_applylist') //导出活动报名表
const Master_list = new Feathers('hr/hrhome/hrthread/master_list') //答主列表
const Quest_list = new Feathers('hr/hrhome/hrthread/questions') //问题列表
const Payfor_answer = new Feathers('hr/hrhome/hrthread/payfor_answer') //支付人气值查看回答
const Master_apply = new Feathers('hr/hrhome/hrthread/master_apply') //答主申请
const RecommendList = new Feathers('hr/hrhome/hractivity/home_recommend_activitys') //强力推荐
const Master_page = new Feathers('hr/hrhome/hrthread/master_page') //答主提问
const ApplyInfo = new Feathers('hr/hrhome/hrthread/apply_info') //申请答主信息
const Give_up_apply = new Feathers('hr/hrhome/hrthread/give_up_apply') //放弃答主申请








// const DeleteCards = new Feathers('hr/hrhome/Card/delCard') //删除交换的名片
const Activity = new Feathers('hr/hrhome/act/hr_activity')
const Order = new Feathers('hr/hrhome/act/order')
const Orders = new Feathers('hr/hrhome/act/orders')
const Collection = new Feathers('hr/hrhome/hr_business_activity')
const Swop = new Feathers('hr/hrhome/hr_swop')
const Photo = new Feathers('hr/hrhome/act/photo')
const Referral = new Feathers('hr/hrhome/act/referral')
const Detail = new Feathers('hr/hrhome/act/details')
const Login = new Feathers('hr/hrhome/hrcard/login') // 登陆
const MyParticipate = new Feathers('hr/hrhome/my/participate')
const MyFavorite = new Feathers('hr/hrhome/my/favorite')
const MyDopayment = new Feathers('hr/hrhome/my/dopayment')
const MyCardcase = new Feathers('hr/hrhome/my/cardcase')
const Question = new Feathers('hr/hrhome/quz/quiz')
const Answerer = new Feathers('hr/hrhome/quz/hr_quiz')
const AnswerDetail = new Feathers('hr/hrhome/quz/problem')
const AnswererDetail = new Feathers('hr/hrhome/quz/AnsDetail')
const MyQuiz = new Feathers('hr/hrhome/quz/myquiz')
const MyOnlooker = new Feathers('hr/hrhome/quz/myonlooker')
const Answered = new Feathers('hr/hrhome/quz/answered')
const DoAnswerer = new Feathers('hr/hrhome/quz/doanswerer')
const QuizDetail = new Feathers('hr/hrhome/quz/QuizDetail')
const Consent = new Feathers('hr/hrhome/bus/consent')
const Newapp = new Feathers('hr/hrhome/bus/newapp')
const ActivityNearBy = new Feathers('hr/hrhome/act/activity')
const Search = new Feathers('hr/hrhome/bus/searchs')
const Filter = new Feathers('hr/hrhome/bus/filtrate')
const Sign = new Feathers('hr/hrhome/act/dosign')
const About = new Feathers('hr/hrhome/hr')
const ToBeAnswer = new Feathers('hr/hrhome/quz/plus')
const ActSearch = new Feathers('hr/hrhome/act/search')
const Plus = new Feathers('hr/hrhome/bus/plus')
const QrCode = new Feathers('hr/hrhome/qrcode')
const PostQuestions = new Feathers('hr/hrhome/quz/questions')
const Pay = new Feathers('hr/hrhome/act/payment')
const Onlooker = new Feathers('hr/hrhome/quz/onlooker')
const Message = new Feathers('hr/hrhome/sendSms')
const Decoding = new Feathers('hr/hrhome/decoding')
const LogoQrcode = new Feathers('hr/hrhome/logoqrcode')
const Explain = new Feathers('hr/hrhome/quz/explain')
const Particulars = new Feathers('hr/hrhome/particulars')
const Group = new Feathers('hr/hrhome/Grou/getName')
const AddGroup = new Feathers('hr/hrhome/Grou/addGrou')
const DeleteGroup = new Feathers('hr/hrhome/Grou/delGrouId')
const ContactInGroup = new Feathers('hr/hrhome/Grou/getList')
const ContactAddGroupList = new Feathers('hr/hrhome/Grou/addCard')
const DeleteContactsInGroup= new Feathers('hr/hrhome/Grou/delBusId')
const NoGroup = new Feathers('hr/hrhome/Grou/addList')
const MyLike = new Feathers('hr/hrhome/Farou/getYLook')//我赞了谁
const CollectMe = new Feathers('hr/hrhome/Card/getList')//谁收藏了我
const FavorMe = new Feathers('hr/hrhome/Farou/getMLook')//谁赞了我
const MyCollect = new Feathers('hr/hrhome/Faror/getMLook')//我收藏了谁
const CNXH_All = new Feathers('hr/hrhome/bus/getAll')
const CNXH_Industry = new Feathers('hr/hrhome/bus/getBusIndustry')
const CNXH_City = new Feathers('hr/hrhome/bus/getBusCity')
const GetReferrals = new Feathers('hr/hrhome/bus/getReferrals')
const System = new Feathers('hr/hrhome/Sys/getList')
const DeleteSystem = new Feathers('hr/hrhome/Sys/upStatus')
const Recommend = new Feathers('hr/hrhome/Card/Referrals')
const Star = new Feathers('hr/hrhome/Card/Status')
const LikeStatus = new Feathers('hr/hrhome/Farou/upStatus')
const WatchStatus = new Feathers('hr/hrhome/Wat/upStatus')
const CollectStatus = new Feathers('hr/hrhome/Card/getStatus')
const LookCard = new Feathers('hr/hrhome/Wat/setLook')
const LikeCard = new Feathers('hr/hrhome/hrcard/zan') // 点赞
const UnLikeCard = new Feathers('hr/hrhome/hrcard/zan') // 取消点赞
const UnStar = new Feathers('hr/hrhome/Card/UpStatus')
const AddRemark = new Feathers('hr/hrhome/Bus/addRemark')
const Shield = new Feathers('hr/hrhome/Card/Shield')
const InGroup = new Feathers('hr/hrhome/Card/getGrou')
const ChatGroup = new Feathers('hr/hrhome/chat/load')
const Banner = new Feathers('hr/hrhome/cou/getban')
const QuestionLike = new Feathers('hr/hrhome/quz/setLike')
const QuestionUnLike = new Feathers('hr/hrhome/quz/delLike')
const Figure = new Feathers('hr/hrhome/cou/figure')
const FigureSearch = new Feathers('hr/hrhome/cou/fsearch')
const LessonDetail = new Feathers('hr/hrhome/cou/detail')
const Comment = new Feathers('hr/hrhome/cou/comment')
const AddComment = new Feathers('hr/hrhome/cou/addCom')
const Original= new Feathers('hr/hrhome/cou/original')
const OriginalSearch= new Feathers('hr/hrhome/cou/osearch')
const StudyLesson= new Feathers('hr/hrhome/cou/getclass')
const MyAnswer= new Feathers('hr/hrhome/quz/myAns')
const DeleteComment= new Feathers('hr/hrhome/cou/delCom')
const StudyLessonSearch= new Feathers('hr/hrhome/cou/csearch')
const ClassifyLesson= new Feathers('hr/hrhome/cou/coulist')
const DeleteAnswer= new Feathers('hr/hrhome/quz/delAns')
const LessonLike= new Feathers('hr/hrhome/cou/setLike')
const LessonDisLike= new Feathers('hr/hrhome/cou/delLike')
const LessonLooker= new Feathers('hr/hrhome/cou/onlooker')
const History= new Feathers('hr/hrhome/chat/load')
const SaveHistory= new Feathers('hr/hrhome/chat/save_message')
const UpShield= new Feathers('hr/hrhome/Card/upShield')
const Ishie= new Feathers('hr/hrhome/Card/ishie')
const Index= new Feathers('hr/hrhome/cou/index')
const ActivityGround= new Feathers('hr/hrhome/act/getIndex') // HR活动圈的列表数据
const GetIncome= new Feathers('hr/hrhome/bus/getincome')
const GetExpend= new Feathers('hr/hrhome/bus/getexpend')
// const MyActivity= new Feathers('hr/hrhome/act/getinitiator')
const ActBanner= new Feathers('hr/hrhome/act/getban') // HR活动圈的轮播图数据
const ActLike= new Feathers('hr/hrhome/act/setLike')
const ActDelLike= new Feathers('hr/hrhome/act/delLike')
const LookApply= new Feathers('hr/hrhome/act/lookApply')
const ActAddApply= new Feathers('hr/hrhome/act/addApply')
const Applyfind= new Feathers('hr/hrhome/act/applyfind')
const ActComment= new Feathers('hr/hrhome/act/comment')
const ActAddCom= new Feathers('hr/hrhome/act/addCom')
const ActDelCom= new Feathers('hr/hrhome/act/delCom')
const UpAct = new Feathers('hr/hrhome/act/upAct')
const UpLookSystemt = new Feathers('hr/hrhome/Sys/upLook')

module.exports = {
  GetMobile,
  ChangeCard,
  Card,
  CardDetail,
  MyCard,
  MyCardDetail,
  SaveFormID,
  DeleteCard,
  FavCard,
  DelSearch,
  ViewList,
  FavList,
  ZanList,
  ActivityList,
  ActivityDetailData,
  ActivityImgs,
  FavActivity,
  ZanActivity,
  GetActivityPL,
  AddActivityPL,
  DelActivityPL,
  MyActivity,
  CheckApply,
  Apply,
  CancelApply,
  AddActivity,
  HotActivity,
  ApplyList,
  ApplyDetail,
  ActivityQbcode,
  BannerList,
  CardImg,
  NotifyList,
  DelNotify,
  MyCardsHolder,
  MyCardRequst,
  CardAgree,
  GroupList,
  CreateGroup,
  EditGroup,
  DelGroup,
  GetGroupPeople,
  AddGroupPeople,
  DelGroupPeople,
  GroupListById,
  MyEvent,
  VipStatus,
  GetPageUrl,
  SignImg,
  DetailContext,
  ExportApplylist,
  Remake,
  Master_list,
  Quest_list,
  Payfor_answer,
  Master_apply,
  RecommendList,
  Master_page,
  ApplyInfo,
  Give_up_apply,



  Activity,
  Order,
  Orders,
  Collection,
  Swop,
  Photo,
  Detail,
  Login,
  MyParticipate,
  MyFavorite,
  MyDopayment,
  MyCardcase,
  Apply,
  Question,
  Answerer,
  AnswererDetail,
  MyQuiz,
  MyOnlooker,
  Answered,
  DoAnswerer,
  QuizDetail,
  Consent,
  Newapp,
  ActivityNearBy,
  Search,
  AnswerDetail,
  Referral,
  Sign,
  Filter,
  About,
  ToBeAnswer,
  ActSearch,
  Plus,
  QrCode,
  PostQuestions,
  Pay,
  Onlooker,
  Message,
  Decoding,
  LogoQrcode,
  Explain,
  Particulars,
  Group,
  AddGroup,
  DeleteGroup,
  ContactInGroup,
  ContactAddGroupList,
  DeleteContactsInGroup,
  NoGroup,
  FavorMe,
  CollectMe,
  CNXH_All,
  CNXH_Industry,
  CNXH_City,
  GetReferrals,
  Report,
  // DeleteCards,
  System,
  DeleteSystem,
  Recommend,
  Star,
  LikeStatus,
  MyLike,
  MyCollect,
  WatchStatus,
  CollectStatus,
  LookCard,
  LikeCard,
  UnLikeCard,
  UnStar,
  AddRemark,
  Shield,
  InGroup,
  ChatGroup,
  Banner,
  QuestionLike,
  QuestionUnLike,
  Figure,
  FigureSearch,
  LessonDetail,
  Comment,
  AddComment,
  Original,
  OriginalSearch,
  StudyLesson,
  MyAnswer,
  DeleteComment,
  StudyLessonSearch,
  ClassifyLesson,
  DeleteAnswer,
  LessonLike,
  LessonDisLike,
  LessonLooker,
  History,
  SaveHistory,
  UpShield,
  Ishie,
  Index,
  ActivityGround,
  GetIncome,
  GetExpend,
  ActBanner,
  ActLike,
  ActDelLike,
  LookApply,
  ActAddApply,
  Applyfind,
  ActComment,
  ActAddCom,
  ActDelCom,
  UpAct,
  UpLookSystemt,
}