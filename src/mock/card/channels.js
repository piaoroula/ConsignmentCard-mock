import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let channelsData = []
const count = 5
var data
channelsData.push(
  {
    id: 0,
    name: "移动充值卡",
    buyRate: 20,
    privates: '是',
    state: true
  },
  {
    id: 1,
    name: "联通充值卡",
    buyRate: 30,
    privates: '是',
    state: true
  },
  {
    id: 2,
    name: "电信全国充值卡",
    buyRate: 40,
    privates: '否',
    state: false
  }
)
// for (var i = 0; i < count; i++) {
//   channelsData.push(Mock.mock({
//     'id': i,//编号
//     'buyRate|1-100': 100,
//     'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
//     'private|1': ['是', '否'],
//     'state': [true, false],//true=>正常，false=>禁用
//   }))
// }
export default {
  getchannels: config => {
    const { limit = 20, page = 1 } = param2Obj(config.url)
    const pagelist = channelsData.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      data: pagelist,
      total: channelsData.length,
    }
  },
  //新增通道
  addChannel: config => {
    const { name, buyRate, privates } = JSON.parse(config.body)
    //获取通道列表的最大id
    //b-a从大到小，a-b从小到大
    var idArry = []
    channelsData.forEach(item => {
      idArry.push(item.id)
    })
    var max2 = idArry.sort(function (a, b) {
      return b - a;
    })[0];
    if (name != undefined && buyRate != undefined && privates != undefined) {
      this.channelsData.push({

      })
    }
  },
  //修改状态
  changeChannelState: config => {
    const { id, state } = JSON.parse(config.body)
    channelsData.some(u => {
      if (u.id === id) {
        u.state = state
        data = {
          code: 0,
          msg: '修改成功'
        }
        return true
      } else {
        data = {
          code: 1,
          msg: '参数错误'
        }
        return false
      }
    })
    return data
  }
}