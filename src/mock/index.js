import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import changePwdAPI from './changePwd'
import userInfAPI from './userinfo'
import carsdAPI from './card/cards'
import channelAPI from './card/channel'
import channelsAPI from './card/channels'
import consignmentAPI from './card/consignment'
import consumptionAPI from './card/consumption'
import recordAPI from './card/record'
import statisticsAPI from './card/statistics'
import settlementAPI from './finance/settlement'
import detailAPI from './finance/detail'
import settlementrecordAPI from './finance/settlementrecord'
import settlementsAPI from './finance/settlements'
import financesAPI from './finance/finances'
import usersAPI from './system/users'
import roleAPI from './system/role'
import identityAPI from './system/identity'
// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

//个人中心--修改密码
Mock.mock(/\/api\/Account\/ChangePwd/, 'post', changePwdAPI.upPass)
//账号管理
Mock.mock(/\/api\/Account\/GetUser/, 'get', userInfAPI.getUserInf)
Mock.mock(/\/api\/Account\/SendSmsCode/, 'post', userInfAPI.sendCodeMessage)
Mock.mock(/\/api\/Account\/Submit/, 'post', userInfAPI.submitAcount)
Mock.mock(/\/api\/Account\/UpdateCallbackUrl/, 'post', userInfAPI.UpdateCallbackUrlData)



//寄售管理
Mock.mock(/\/api\/Manage\/GetCards/, 'post', carsdAPI.getCardData)
Mock.mock(/\/api\/Manage\/UpdateCardState/, 'post', carsdAPI.changeUseState)
Mock.mock(/\/api\/Manage\/GetPassword/, 'post', carsdAPI.catchPass)
Mock.mock(/\/api\/Manage\/Supplement/, 'post', carsdAPI.addbujiesuan)

//通道列表
Mock.mock(/\/api\/Channel\/Index/, 'get', channelAPI.getchannelData)



//通道管理
Mock.mock(/\/api\/Manage\/GetChannelsPage/, 'get', channelsAPI.getchannels)
Mock.mock(/\/api\/Manage\/UpdateChannelState/, 'post', channelsAPI.changeChannelState)
Mock.mock(/\/api\/Manage\/AddChannel/, 'post', channelsAPI.addChannel)
Mock.mock(/\/api\/Manage\/ChannelRate/, 'get', channelsAPI.getBuyRate)
Mock.mock(/\/api\/Manage\/UpdateChannelRate/, 'post', channelsAPI.handelBuyRate)


//我要寄售
Mock.mock(/\/api\/Channel\/GetChannels/, 'get', consignmentAPI.getChannelList) //获取寄售通道列表
Mock.mock(/\/api\/Channel\/GetFaceValues/, 'get', consignmentAPI.getFaceValuesData) //获取卡面值
Mock.mock(/\/api\/Card\/Consignment/, 'post', consignmentAPI.SubmitConsignment) //普通寄售提交
Mock.mock(/\/api\/Card\/AutoConsignment/, 'post', consignmentAPI.SubmitQuickConsignment) //快速寄售提交
Mock.mock(/\/api\/Manage\/UpdateFacevalueState/, 'post', consignmentAPI.changeFacevalueState) //修改卡面值状态
Mock.mock(/\/api\/Manage\/AddfaceValue/, 'post', consignmentAPI.addFacevalue) //新增卡面值

//渠道管理
Mock.mock(/\/api\/manage\/listConsumptionAll/, 'get', consumptionAPI.getconsumptionData)


//寄售详情
Mock.mock(/\/api\/Card\/GetRecords/, 'post', recordAPI.getrecordData)
Mock.mock(/\/api\/Card\/GetStatistics/, 'post', recordAPI.getCountData)


//寄售汇总
Mock.mock(/\/api\/Card\/GetMStatistics/, 'post', statisticsAPI.getStatisticsData)   //获取寄售面值分析
Mock.mock(/\/api\/Card\/GetUStatistics/, 'post', statisticsAPI.getStatisticsUserData)   ///获取寄售用户分析


//---财务操作---
//申请提现
Mock.mock(/\/api\/Finance\/GetSettlement/, 'get', settlementAPI.getAccounts)
Mock.mock(/\/api\/Finance\/Settlement/, 'post', settlementAPI.submitAccount)

//财务明细
Mock.mock(/\/api\/Finance\/GetFinances/, 'post', detailAPI.getFinanceDetail)

//提现记录
Mock.mock(/\/api\/Finance\/GetSettementRecord/, 'post', settlementrecordAPI.getFinanceDetail)


//提现审核
Mock.mock(/\/api\/Manage\/GetSettlementPage/, 'post', settlementsAPI.getsettlementData)
Mock.mock(/\/api\/Manage\/UpdateSettlementState/, 'post', settlementsAPI.changeSettlementState)
Mock.mock(/\/api\/Manage\/GetSettlementAccount/, 'get', settlementsAPI.getSettlementInf)


//财务审计
Mock.mock(/\/api\/Manage\/GetFinances/, 'post', financesAPI.getFinancesData)


//系统管理
Mock.mock(/\/api\/Manage\/GetUsers/, 'post', usersAPI.getusersData)
Mock.mock(/\/api\/Manage\/UpdateUserState/, 'post', usersAPI.changeUserState)
Mock.mock(/\/api\/Manage\/UpdateConsignState/, 'post', usersAPI.changeConsignState)
Mock.mock(/\/api\/Manage\/updateConsignState/, 'post', usersAPI.getAccountInf)
Mock.mock(/\/api\/Manage\/getUserPrice/, 'post', usersAPI.getPriceData)
Mock.mock(/\/api\/Manage\/GetUserProductPrice/, 'post', usersAPI.getPoductData)
Mock.mock(/\/api\/Manage\/UpdateUserChannelConsignState/, 'post', usersAPI.UserChannelConsignState)
Mock.mock(/\/api\/Manage\/UpdateUserProductOrderState/, 'post', usersAPI.ProductOrderState)
Mock.mock(/\/api\/Manage\/GetRoles/, 'get', roleAPI.getRoleList)
Mock.mock(/\/api\/Manage\/GetRoleById/, 'get', roleAPI.getUserRoles)
Mock.mock(/\/api\/Manage\/UpdateUserRole/, 'post', roleAPI.changeRole)
Mock.mock(/\/api\/Account\/GetIdentification/, 'post', identityAPI.getIdentity)


// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)



// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock
