import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let statisticsData = []
let statisticsUserData = []
const count = 5
for (var i = 0; i < count; i++) {
  statisticsData.push(Mock.mock({
    'index': i,// 序号 属性值自动加 1，初始值为 1
    'channelId|1': [1, 2, 3],// 卡名称 随机选取 1 个元素,1=>移动充值卡,2=>联通充值卡,3=>电信全国充值卡
    'channelName|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'doubtCount': '@integer(60, 100)',
    'faceValue': '@integer(60, 100)',
    'faceValueTotal': '@integer(60, 100)',
    'failCount|1': '@integer(60, 100)',
    'inconformityCount': '@integer(60, 100)',
    'processCount': '@integer(60, 100)',
    'settlementAmountTotal': '@integer(60, 100)',
    'settlementFaceValueTotal': '@integer(60, 100)',
    'successCount': '@integer(60, 100)',
    'total': '@integer(60, 100)',
  }))
}
for (var i = 0; i < count; i++) {
  statisticsUserData.push(Mock.mock({
    'index': i,// 序号 属性值自动加 1，初始值为 1
    'channelId|1': [1, 2, 3],// 卡名称 随机选取 1 个元素,1=>移动充值卡,2=>联通充值卡,3=>电信全国充值卡
    'channelName|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'doubtCount': '@integer(60, 100)',
    'faceValue': '@integer(60, 100)',
    'faceValueTotal': '@float(60, 100, 3, 5)',
    'failCount|1': '@integer(60, 100)',
    'inconformityCount': '@integer(60, 100)',
    'processCount': '@integer(60, 100)',
    'settlementAmountTotal': '@integer(60, 100)',
    'settlementFaceValueTotal': '@integer(60, 100)',
    'successCount': '@integer(60, 100)',
    'total': '@integer(60, 100)',
    'realName|1': ['张三', '李四', '王五']
  }))
}
export default {
  getStatisticsData: config => {
    const { beginTime, endTime } = JSON.parse(config.body)
    let mockList = statisticsData.filter(item => {
      if (beginTime && item.beginTime < beginTime) return false
      if (endTime && item.endTime > endTime) return false
      return true
    })
    return {
      code: 0,
      items: mockList,
    }

  },
  getStatisticsUserData: config => {
    const { beginTime, endTime } = JSON.parse(config.body)
    let mockList = statisticsUserData.filter(item => {
      if (beginTime && item.beginTime < beginTime) return false
      if (endTime && item.endTime > endTime) return false
      return true
    })
    return {
      code: 0,
      items: mockList,
    }

  }
}