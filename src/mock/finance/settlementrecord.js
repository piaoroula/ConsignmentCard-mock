import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { userinfoData } from '../userinfo.js'
const settlementrecordData = []
var data
var count = 5
for (var i = 0; i < count; i++) {
  settlementrecordData.push(Mock.mock({
    'id': '@increment',
    'name': userinfoData.name,
    'institution': '@natural(60,100)',
    'amount': '@natural(500,5000)',
    'creationTime': '@now()',
    'processTime': new Date(new Date().getTime() - 1 * 5 * 1000),
    'state|1': [0, 1, 2, 3],//0=>待处理，1=>处理中,2=>成功，3=>失败,
    'remark': '@csentence',
  }))
}
export default {
  getFinanceDetail: config => {
    const { beginTime, endTime, state, page = 1, limit = 20 } = JSON.parse(config.body)
    let mockList = settlementrecordData.filter(item => {
      if (beginTime && item.creationTime < beginTime) return false
      if (endTime && item.creationTime > endTime) return false
      if (state && item.state !== state) return false
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