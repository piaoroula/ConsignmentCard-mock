import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let cardsData = []
const count = 5
for (var i = 0; i < count; i++) {
  cardsData.push(Mock.mock({
    id: i,// 序号 属性值自动加 1，初始值为 1
    'cardNumber': '@increment(100)',
    'userName|1': ['张三', '李四', '王五'],
    'realName|1': ['张三', '李四', '王五'],
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'consumptionName|1': ['渠道1', '渠道2', '渠道3'],
    'faceValue': '@integer(60, 100)',
    'settlementFaceValue': '@integer(60, 100)',
    'settlementAmount': '@integer(60, 100)',
    'useState|1': [0, 1, 2, 3, 4, 5, 6],// 卡状态 随机选取 1 个元素,0=>待处理,1=>已取出,2=>处理中,3=>成功,4=>失败,5=>可疑,6=>可疑核查中,7=>未知
    'userTime': '5',
    'takeOutTime': '@datetime',
    'submitTime': '@datetime',
    'callbackTime': '@now',
    'addTime': '@datetime',
    'remark': '@csentence(5)',
  }))
}
export default {
  getCardData: config => {
    const { name, buyRate, faceValueId, useState, cardNumber, beginTime, endTime, userNameOrId, limit = 20, page = 1 } = JSON.parse(config.body)
    let mockList = cardsData.filter(item => {
      if (name && item.name != name) return false
      if (buyRate && item.buyRate != buyRate) return false
      if (faceValueId && item.faceValueId != faceValueId) return false
      if (useState && item.useState != useState) return false
      if (cardNumber && item.cardNumber != cardNumber) return false
      if (beginTime && item.beginTime < beginTime) return false
      if (endTime && item.endTime > endTime) return false
      if (userNameOrId && item.userNameOrId != userNameOrId) return false
      return true
    })
    //计算寄售总面值，结算总面值，结算总金额
    var faceValueTotal = 0, settlementFaceValueTotal = 0, settlementAmountTotal = 0
    mockList.forEach(item => {
      faceValueTotal += item.faceValue;
      settlementFaceValueTotal += item.settlementFaceValue
      settlementAmountTotal += item.settlementAmount
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: mockList.length, //线报总数
      items: pageList,     //每一页显示的数据
      data: { faceValueTotal, settlementFaceValueTotal, settlementAmountTotal }
    }

  },




}