import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let consumptionData = []
const count = 5
for (var i = 0; i < count; i++) {
  consumptionData.push(Mock.mock({
    'id': i,//编号
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'isOpen': [true, false],//true=>正常，false=>禁用
  }))
}
export default {
  getconsumptionData: config => {
    return {
      code: 0,
      data: consumptionData,
    }
  }
}