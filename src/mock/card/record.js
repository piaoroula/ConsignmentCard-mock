import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let recordData = []
const count = 100
for (var i = 0; i < count; i++) {
  recordData.push(Mock.mock({
    'id': i,//编号
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'faceValue|1': [20, 30, 40],
    'settlementFaceValue': null,
    'settlementAmount': null,
    'useState|1': [0, 1, 2, 3, 4, 5],// 卡状态 随机选取 1 个元素,0=>待处理,1=>已取出,2=>处理中,3=>成功,4=>失败,5=>可疑,6=>可疑核查中,7=>未知
    'addTime': new Date(new Date().getTime() - 1 * 5 * 1000),
    'callbackTime': '@now()',
    'cardNumber': '@natural(10000)',
    'channelId|1': [0, 1, 2],//0=>移动充值卡,1=>联通充值卡,2=>电信全国充值卡//mock不好设计，此数据省
    'faceValueId|1': [10, 11, 12],//10=>20，11=>30，12=>40
    'remark': '@csentence()',
    'userTime': 5,
  }))
}
recordData.forEach(item => {
  if (item.useState == 3) {
    item.settlementFaceValue = Mock.mock('@integer(60, 100)')
    item.settlementAmount = Mock.mock('@integer(60, 100)')
  }
  switch (item.channelId) {
    case 0:
      item.name = '移动充值卡'
      break;
    case 1:
      item.name = '联通充值卡'
      break;
    case 2:
      item.name = '电信全国充值卡'
      break;
  };
  switch (item.faceValueId) {
    case 10:
      item.faceValue = 20
      break;
    case 11:
      item.faceValue = 30
      break;
    case 12:
      item.faceValue = 40
      break;
  }
})
export default {
  //寄售详情的数据
  getrecordData: config => {
    const { ChannelId, beginTime, endTime, FaceValueId, useState, statisticsState, CardNumber, limit = 20, page = 1 } = JSON.parse(config.body)
    let mockList = recordData.filter(item => {
      if (ChannelId != null) {
        if (item.channelId != JSON.parse(config.body).ChannelId) {
          return false
        }
      }
      if (FaceValueId && item.faceValueId != FaceValueId) return false
      if (statisticsState && item.statisticsState != statisticsState) return false
      if (useState && item.useState != useState) return false
      if (beginTime && item.addTime < beginTime) return false
      if (endTime && item.addTime > endTime) return false
      if (CardNumber && item.cardNumber != CardNumber) return false
      return true
    })
    var inconformityCount = 0
    var successCount = 0
    var failCount = 0
    var processCount = 0
    var faceValueTotal = 0
    var settlementFaceValueTotal = 0
    var settlementAmountTotal = 0
    mockList.forEach(item => {
      faceValueTotal += item.faceValue
      settlementFaceValueTotal += item.settlementFaceValue
      settlementAmountTotal += item.settlementAmount
      switch (item.useState) {
        //如果卡状态为2=》处理中
        case 2:
          processCount++
          break;
        //如果卡状态为3=》成功
        case 3:
          successCount++
          break;
        //如果卡状态为4=》失败
        case 4:
          failCount++
          break;
      }
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 0,
      total: mockList.length, //线报总数
      items: pageList,     //每一页显示的数据
      data: { successCount, failCount, processCount, faceValueTotal, settlementFaceValueTotal, settlementAmountTotal },
    }
  },
}