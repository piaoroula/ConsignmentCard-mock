import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let channelData = []
const count = 5
for (var i = 0; i < count; i++) {
  channelData.push(Mock.mock({
    id: i,//通道ID
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    "rate|1-100.1-10": 1,
    'list|1-10': [{
      'id': /\d{1,10}/,// 面值ID
      'faceValue': '@integer(60, 100)',
      'consignPrice': '@integer(60, 100)',
    }]
  }))
}
export default {
  getchannelData: config => {
    return {
      code: 0,
      data: channelData,
      msg: '获取成功'
    }
  }
}