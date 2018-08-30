import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { userinfoData } from '../userinfo.js'
import { settlementrecordData, count } from './settlementrecord.js'
let settlementData = []
let acountData = []
var data
var m = count
for (var i = 0; i < m; i++) {
  settlementData.push(Mock.mock({
    'id': null,
    'name': userinfoData.name,
    'realName': userinfoData.realName,
    'userName': userinfoData.email,
    'institution': null,
    'amount': null,
    'balance': userinfoData.balance,
    'creationTime': null,
    'processTime': null,
    'state': null,//0=>待处理，1=>处理中,2=>成功，3=>失败,
    'remark': null,
  }))
}
export default {
  getsettlementData: config => {
    settlementrecordData.forEach(item => {
      if (item.state == 0) {
        item.processTime = null
      } else {
        item.processTime = new Date(new Date().getTime() - 1 * 5 * 1000)
      }
    })

    settlementData.some((i, indexi) => {
      settlementrecordData.some((k, indexj) => {
        if (indexi == indexj) {
          i.id = k.id
          i.institution = k.institution
          i.amount = k.amount
          i.creationTime = k.creationTime
          i.processTime = k.processTime
          i.state = k.state
          i.remark = k.remark
        }
      })
    })
    //计算成功提现金额
    var accounts = 0
    settlementData.forEach(item => {
      if (item.state == 2) {
        accounts += item.amount
      }
    })
    const { userNameOrId, beginTime, endTime, state, page = 1, limit = 20 } = JSON.parse(config.body)
    let mockList = settlementData.filter(item => {
      if (userNameOrId && item.name !== userNameOrId) return false
      if (userNameOrId && item.email !== userNameOrId) return false
      if (beginTime && item.creationTime < beginTime) return false
      if (endTime && item.creationTime > endTime) return false
      if (state && item.state !== state) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      accounts,
      total: mockList.length,
      item: pageList
    }
  },
  //修改提现状态
  changeSettlementState: config => {
    const { id, state, remark } = JSON.parse(config.body)
    settlementrecordData.some(L => {
      if (L.id === id) {
        L.state = state
        L.remark = remark
        data = {
          code: 0,
          msg: '修改成功'
        }
        return true
      } else {
        data = {
          code: 1,
          msg: '修改失败'
        }
        return false
      }
    })
    return data
  },
  //查看收款信息
  getSettlementInf: config => {
    const { id } = param2Obj(config.url)
    settlementrecordData.some(item => {
      if (item.id === JSON.parse(id)) {
        data = {
          code: 0,
          msg: '获取成功'
        }
        return true
      } else {
        data = {
          code: 1,
          msg: '参数错误'
        }
        return false
      }
    })
    return data
  }


} 