import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import changePwdAPI from './changePwd'
import userInfAPI from './userinfo'
import carsdAPI from './cards'
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
Mock.mock(/\/api\/Manage\/GetCards/, 'get', carsdAPI.getCardData)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock
