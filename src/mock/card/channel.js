import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let channelData = []
const count = 3
for (var i = 0; i < count; i++) {
  channelData.push(Mock.mock({
    'id|1': [0, 1, 2],//0=>移动充值卡,1=>联通充值卡,2=>电信全国充值卡
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
    //对应状态的转化
    channelData.forEach(item => {
      console.log(DataTransferItem)
      if (item.id === 0) {
        item.name === '移动充值卡'
      } else if (item.id === 1) {
        item.name === '联通充值卡'
      } else if (item.id === 2) {
        item.name === '电信全国充值卡'
      }
    })
    return {
      code: 0,
      data: channelData,
      msg: '获取成功'
    }
  }
}