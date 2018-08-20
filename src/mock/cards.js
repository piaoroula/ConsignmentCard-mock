import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let cardsData = []
const count = 5
for (var i = 0; i < count; i++) {
  cardsData.push(Mock.mock({
    id: '@increment',
    cardNumber: '@id',
    userName: '@cname',
    realName: '',
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    consumptionName: '某某',
    faceValue: '@intege',
    settlementFaceValue: '@intege',
    settlementAmount: '@intege',
    'useState|1': ['待处理', '', '已取出', '处理中', '成功', '失败', '可疑'],
    takeOutTime: '@time("s")',
    submitTime: '@datetime',
    callbackTime: '@now',
    addTime: '@datetime',
    remark: '@csentence(5)',
  }))
}
export default {
  getCardData: config => {
    const { name, buyRate, faceValueId, useState, cardNumber, beginTime, endTime, userNameOrId, limit = 20, page = 1 } = param2Obj(config.url)
    const cardsFilterDta = cardsData.filter(item => {
      if (item.name != name) return false
      if (item.buyRate != buyRate) return false
      if (item.faceValueId != faceValueId) return false
      if (item.useState != useState) return false
      if (item.cardNumber != cardNumber) return false
      if (item.beginTime < beginTime) return false
      if (item.endTime > endTime) return false
      if (item.userNameOrId != userNameOrId) return false
      return true
    })
    const pageList = cardsFilterDta.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: cardsFilterDta.length,
      items: pageList
    }
  }
}