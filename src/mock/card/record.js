import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let recordData = []
const count = 3
for (var i = 0; i < count; i++) {
  recordData.push(Mock.mock({
    'id': i,//编号
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'useState|1': [0, 1, 2, 3, 4, 5, 6],// 卡状态 随机选取 1 个元素,0=>待处理,1=>已取出,2=>处理中,3=>成功,4=>失败,5=>可疑,6=>可疑核查中,7=>未知
    'addTime': new Date(new Date().getTime() - 1 * 5 * 1000),
    'callbackTime': '@now()',
    'cardNumber': '@natural(10000)',
    // 'channelId|1': [0, 1, 2],//0=>移动充值卡,1=>联通充值卡,2=>电信全国充值卡//mock不好设计，此数据省
    'faceValue': '@integer(60, 100)',
    'faceValueId': '@natural(10000)',
    'remark': '@csentence()',
    'userTime': 5,
  }))
}
export default {
  getrecordData: config => {
    const { name, beginTime, endTime, FaceValueId, useState, statisticsState, CardNumber, limit = 20, page = 1 } = JSON.parse(config.body)
    let mockList = recordData.filter(item => {
      if (name && item.name != name) return false
      if (FaceValueId && item.FaceValueId != FaceValueId) return false
      if (statisticsState && item.statisticsState != statisticsState) return false
      if (useState && item.useState != useState) return false
      if (beginTime && item.addTime < beginTime) return false
      if (endTime && item.addTime > endTime) return false
      if (CardNumber && item.CardNumber != CardNumber) return false
      return true
    })

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: mockList.length, //线报总数
      items: pageList,     //每一页显示的数据
    }
  }
}