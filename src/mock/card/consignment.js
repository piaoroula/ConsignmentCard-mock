import Mock from 'mockjs'
import { param2Obj, isvalidateCards } from '@/utils'
let channelList = [] // 获取卡类型
let faceValuesData = []// 获取卡面值
const count = 5
var data

for (var i = 0; i < count; i++) {
  channelList.push(Mock.mock({
    'id': i,//编号
    'buyRate|1-100': 100,
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
  }))
}
for (var i = 0; i < count; i++) {
  faceValuesData.push(Mock.mock({
    'id': i,//编号
    'consignPrice': '@integer(60, 100)',
    'faceValue': '@integer(60, 100)',
    'state|1': [true, false],
  }))
}
export default {
  // 获取卡类型
  getChannelList: config => {
    return {
      code: 0,
      data: channelList,
    }
  },
  // 获取卡面值
  getFaceValuesData: config => {
    const { cid } = param2Obj(config.url)
    if (cid != undefined) {
      return {
        code: 0,
        data: faceValuesData,
      }
    } return {
      code: 1,
      msg: '获取卡面值失败',
    }
  },
  //普通寄售提交
  SubmitConsignment: config => {
    const { Channel, FaceValue, Cards } = JSON.parse(config.body)
    // if (isvalidateCards(Cards)) {
    //   if (FaceValue != undefined && Cards != undefined) {
    //     data = {
    //       code: 0,
    //       msg: '寄售成功'
    //     }
    //   } else {
    //     data = {
    //       code: 1,
    //       msg: '寄售失败'
    //     }
    //   }
    // } else {
    //   data = {
    //     code: 2,
    //     msg: '格式不正确。必须为卡号[任意分隔符]密码'
    //   }
    // }
    // return data
    if (FaceValue != undefined && Channel != undefined) {
      data = {
        code: 0,
        msg: '寄售成功'
      }
    } else {
      data = {
        code: 1,
        msg: '无效的参数'
      }
    }
    return data
  },
  //快速提交
  SubmitQuickConsignment: config => {
    const { facevalue, Cards } = JSON.parse(config.body)
    // if (isvalidateCards(Cards)) {
    //   if (FaceValue != undefined && Cards != undefined) {
    //     data = {
    //       code: 0,
    //       msg: '寄售成功'
    //     }
    //   } else {
    //     data = {
    //       code: 1,
    //       msg: '寄售失败'
    //     }
    //   }
    // } else {
    //   data = {
    //     code: 2,
    //     msg: '格式不正确。必须为卡号[任意分隔符]密码'
    //   }
    // }
    // return data
    if (facevalue != undefined && Cards != undefined) {
      data = {
        code: 0,
        msg: '寄售成功'
      }
    } else {
      data = {
        code: 1,
        msg: '无效的参数'
      }
    }
    return data
  }
}