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
  //修改卡面值状态
  changeFacevalueState: config => {
    const { id, state } = JSON.parse(config.body)
    faceValuesData.some(u => {
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
  },
  //新增卡面值
  addFacevalue: config => {
    const { channelId, faceValue } = JSON.parse(config.body)
    //获取面值列表的最大id
    //b-a从大到小，a-b从小到大
    var idArry = []
    faceValuesData.forEach(item => {
      idArry.push(item.id)
    })
    var maxId = idArry.sort(function (a, b) {
      return b - a;
    })[0];
    var faceValueArry = []
    //过滤重复提交的面值
    faceValuesData.forEach(item => {
      faceValueArry.push(item.faceValue)
    })
    if (faceValueArry.indexOf(faceValue) < 0) {
      if (faceValue != null) {
        var addData = {
          id: maxId + 1,
          faceValue: faceValue,
        }
        faceValuesData.splice(0, 0, addData)
        data = {
          code: 0,
          msg: '添加面值成功'
        }
        // return true
      } else {
        data = {
          code: 1,
          msg: '参数错误'
        }
      }
      return data
    } else {
      console.log('重复提交')
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