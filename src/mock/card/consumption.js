import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let consumptionData = []
const count = 5
consumptionData.push({
  'id': 1,//编号
  'name': '渠道1',
  'isOpen': true,//true=>正常，false=>禁用
}, {
    'id': 2,//编号
    'name': '渠道2',
    'isOpen': false,//true=>正常，false=>禁用
  }, {
    'id': 3,//编号
    'name': '渠道3',
    'isOpen': false,//true=>正常，false=>禁用
  })
// for (var i = 0; i < count; i++) {
//   consumptionData.push(Mock.mock({
//     'id': i,//编号
//     'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
//     'isOpen': [true, false],//true=>正常，false=>禁用
//   }))
// }
export default {
  getconsumptionData: config => {
    return {
      code: 0,
      data: consumptionData,
    }
  }
}