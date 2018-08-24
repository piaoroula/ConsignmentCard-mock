import Mock from 'mockjs'
import { param2Obj, isvalidateCards } from '@/utils'
let channelList = [] // 获取卡类型
let faceValuesData = []// 获取卡面值
const count = 3
var data
channelList.push(
  {
    id: 0,
    name: "移动充值卡",
    buyRate: 20,
  },
  {
    id: 1,
    name: "联通充值卡",
    buyRate: 30,
  },
  {
    id: 2,
    name: "电信全国充值卡",
    buyRate: 40,
  }
)
faceValuesData.push(
  {
    id: 10,
    consignPrice: 19.2,
    faceValue: 20,
    state: true
  },
  {
    id: 11,
    consignPrice: 12,
    faceValue: 30,
    state: false
  },
  {
    id: 12,
    consignPrice: 18,
    faceValue: 40,
    state: false
  }
)
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
    var item = [];
    // var reason, row, cardNumber;
    for (var i = 0; i < Cards.length; i++) {
      item.push({
        'row': i,
        'cardNumber': Cards[i],
        'reason': "通道推断失败"
      })
    }
    if (facevalue != undefined && Cards != undefined) {
      data = {
        code: 2,
        msg: '本次提交的所有卡密均无法寄售',
        item
      }
    } else {
      data = {
        code: 3,
        msg: '无效的参数'
      }
    }
    return data
  }
}