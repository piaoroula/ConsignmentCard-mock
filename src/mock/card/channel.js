import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let channelData = []
const count = 3
channelData.push({
  id: 0,
  name: '移动充值卡',
  rate: 20,
  list: [{
    id: 10,
    consignPrice: 19.2,
    faceValue: 20,
  },
  {
    id: 11,
    consignPrice: 12,
    faceValue: 30,
  },
  {
    id: 12,
    consignPrice: 18,
    faceValue: 40,
  }]
}, {
    id: 1,
    name: '联通充值卡',
    rate: 30,
    list: [{
      id: 10,
      consignPrice: 19.2,
      faceValue: 20,
    },
    {
      id: 11,
      consignPrice: 12,
      faceValue: 30,
    },
    {
      id: 12,
      consignPrice: 18,
      faceValue: 40,
    }]
  }, {
    id: 2,
    name: '电信全国充值卡',
    rate: 40,
    list: [{
      id: 10,
      consignPrice: 19.2,
      faceValue: 20,
    },
    {
      id: 11,
      consignPrice: 12,
      faceValue: 30,
    },
    {
      id: 12,
      consignPrice: 18,
      faceValue: 40,
    }]
  })
// for (var i = 0; i < count; i++) {
//   channelData.push(Mock.mock({
//     'id|1': [0, 1, 2],//0=>移动充值卡,1=>联通充值卡,2=>电信全国充值卡
//     'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
//     "rate|1-100.1-10": 1,
//     'list|1-10': [{
//       'id': /\d{1,10}/,// 面值ID
//       'faceValue': '@integer(60, 100)',
//       'consignPrice': '@integer(60, 100)',
//     }]
//   }))
// }

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