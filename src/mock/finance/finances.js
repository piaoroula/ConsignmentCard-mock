import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { userinfoData } from '../userinfo.js'
import { financeDetailData } from './detail'
const financesData = []
var data
var count = 50
for (var i = 0; i < count; i++) {
  financesData.push(Mock.mock({
    'id': '@increment',
    'name': userinfoData.name,
    'realName': userinfoData.realName,
    'userName': userinfoData.email,
    'cardNumber': '@natural(10000)',
    'type|1': [0, 1],//0=>支出,1=?收入
    'classify|1': [0, 1, 2, 3],//0=>寄售收入，1=>补结算收入,2=>提现支出，3=>提现失败退回收入,
    'beforeAmount': '@natural(500,5000)',
    'amount': '@natural(400,500)',
    'afterAmount': null,
    'creationTime': '@now()',
    'remark': '@csentence',
  }))
}
export default {
  getFinancesData: config => {
    financesData.forEach(item => {
      if (item.classify == 2) {
        item.type = 0
      } else if (item.classify == 0 || item.classify == 1 || item.classify == 3) {
        item.type = 1
      }
    })
    const { beginTime, endTime, type, userNameOrId, classify, page = 1, limit = 20 } = JSON.parse(config.body)
    let mockList = financesData.filter(item => {
      if (beginTime && item.creationTime < beginTime) return false
      if (endTime && item.creationTime > endTime) return false
      if (userNameOrId && item.realName !== userNameOrId && item.userName !== userNameOrId) return false
      if (type != null) {
        if (item.type !== JSON.parse(config.body).type) {
          return false
        }
      }
      if (classify != null) {
        if (item.classify !== JSON.parse(config.body).classify) {
          return false
        }
      }
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: mockList.length,
      item: pageList
    }
  }


} 