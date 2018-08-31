import Mock from 'mockjs'
import { param2Obj } from '@/utils'
const financeDetailData = []
var data
var count = 5
for (var i = 0; i < count; i++) {
  financeDetailData.push(Mock.mock({
    'id': '@increment',
    cardNumber: '@natural(10000)',
    'type|1': [0, 1],//0=>支出，1=>收入
    'classify|1': [0, 1, 2, 3],//0=>寄售收入，1=>补结算收入,2=>提现支出，3=>提现失败退回收入,
    'beforeAmount': '@natural(60,100)',
    'amount': '@natural(60,100)',
    'afterAmount': null,
    'creationTime': '@now()',
    'remark': '@csentence',
  }))
}
export default {
  getFinanceDetail: config => {
    financeDetailData.forEach(item => {
      if (item.classify == 2) {
        item.type = 0
      } else if (item.classify == 0 || item.classify == 1 || item.classify == 3) {
        item.type = 1
      }
    })
    const { beginTime, endTime, type, classify, page = 1, limit = 20 } = JSON.parse(config.body)
    let mockList = financeDetailData.filter(item => {
      if (beginTime && item.creationTime < beginTime) return false
      if (endTime && item.creationTime > endTime) return false
      if (type && item.type !== type) return false
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
export { financeDetailData }