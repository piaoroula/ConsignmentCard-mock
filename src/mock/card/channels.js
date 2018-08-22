import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let channelsData = []
const count = 5
for (var i = 0; i < count; i++) {
  channelsData.push(Mock.mock({
    'id': i,//编号
    'buyRate|1-100': 100,
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'private|1': ['是', '否'],
    'state': [true, false],//true=>正常，false=>禁用
  }))
}
export default {
  getchannels: config => {
    const { limit = 20, page = 1 } = param2Obj(config.url)
    const pagelist = channelsData.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      data: pagelist,
      total: channelsData.length,
    }
  }
}