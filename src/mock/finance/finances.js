import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { userinfoData } from '../userinfo.js'
import { financeDetailData } from './detail'
const financesData = []
var data
var count = 5
for (var i = 0; i < count; i++) {
  financesData.push(Mock.mock({
    'id': '@increment',
    'name': userinfoData.name,
    'realName': userinfoData.realName,
    'cardNumber': '@natural(10000)',
    'type|1': [0, 1],//0=>支出,1=?收入
    'classify|1': [0, 1, 2, 3],//0=>寄售收入，1=>补结算收入,2=>提现支出，3=>提现失败退回收入,
    'beforeAmount': '@natural(60,100)',
    'amount': '@natural(60,100)',
    'afterAmount': null,
    'creationTime': '@now()',
    'remark': '@csentence',
  }))
}
export default {
  getFinancesData: config => {
    const { beginTime, endTime, userNameOrId, classify, page = 1, limit = 20 } = JSON.parse(config.body)
    let mockList = settlementsData.filter(item => {
      if (beginTime && item.creationTime < beginTime) return false
      if (endTime && item.creationTime > endTime) return false
      if (userNameOrId && item.realName !== userNameOrId) return false
      if (userNameOrId && item.userName !== userNameOrId) return false
      if (classify && item.classify !== classify) return false
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