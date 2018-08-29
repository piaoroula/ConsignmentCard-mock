import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { isupdateBCFaceValue } from "@/utils/validate";
let cardsData = []
const count = 10
var data
for (var i = 0; i < count; i++) {
  cardsData.push(Mock.mock({
    id: i,// 序号 属性值自动加 1，初始值为 1
    'cardNumber|1': [200, 300, 400],
    'passValue|1': [200, 300, 400],
    'userName|1': ['1079385523@qq.com', '1079385524@qq.com', '1079385525@qq.com'],
    'realName|1': ['张三', '李四', '王五'],
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'consumptionName|1': ['渠道1', '渠道2', '渠道3'],
    'faceValue|1': [20, 30, 40],
    'settlementFaceValue': '@integer(60, 100)',
    'settlementAmount': '@integer(60, 100)',
    'useState|1': [0, 1, 2, 3, 4, 5, 6],// 卡状态 随机选取 1 个元素,0=>待处理,1=>已取出,2=>处理中,3=>成功,4=>失败,5=>可疑,6=>可疑核查中,7=>未知
    'userTime': '5',
    'takeOutTime': '@datetime',
    'submitTime': '@datetime',
    'callbackTime': '@now',
    'addTime': '@datetime',
    'remark': '@csentence(5)',
  }))
}
export default {
  getCardData: config => {
    const { name, buyRate, faceValueId, useState, cardNumber, beginTime, endTime, userNameOrId, limit = 20, page = 1 } = JSON.parse(config.body)
    cardsData.forEach(item => {
      if (item.userName === '1079385523@qq.com') {
        item.realName = '张三'
      } else if (item.userName === '1079385524@qq.com') {
        item.realName = '李四'
      } else if (item.userName === '1079385525@qq.com') {
        item.realName = '王五'
      }
    })
    cardsData.forEach(item => {
      if (item.cardNumber === 200) {
        item.passValue = 200
      } else if (item.userName === 300) {
        item.passValue = 300
      } else if (item.userName === 400) {
        item.passValue = 400
      }
    })
    let mockList = cardsData.filter(item => {
      if (name && item.name != name) return false
      if (buyRate && item.buyRate != buyRate) return false
      if (faceValueId && item.faceValue != faceValueId) return false
      if (useState && item.useState != useState) return false
      if (cardNumber && item.cardNumber != cardNumber) return false
      if (beginTime && item.beginTime < beginTime) return false
      if (endTime && item.endTime > endTime) return false
      if (userNameOrId && item.realName != userNameOrId) return false
      return true
    })
    //计算寄售总面值，结算总面值，结算总金额
    var faceValueTotal = 0, settlementFaceValueTotal = 0, settlementAmountTotal = 0
    mockList.forEach(item => {
      if (item.useState === 3) {
        faceValueTotal += item.faceValue;
        settlementFaceValueTotal += item.settlementFaceValue
        settlementAmountTotal += item.settlementAmount
      }

    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: mockList.length, //线报总数
      items: pageList,     //每一页显示的数据
      data: { faceValueTotal, settlementFaceValueTotal, settlementAmountTotal }
    }
  },
  //修改寄售状态
  changeUseState: config => {
    const { id, useState, updateBCFaceValue } = JSON.parse(config.body)
    cardsData.some(item => {
      if (item.id != id) {
        data = {
          code: 1,
          msg: '参数错误'
        }
        return false
      } else if (useState === 3 && !isupdateBCFaceValue(updateBCFaceValue)) {
        data = {
          code: 2,
          msg: '寄售状态改为成功时，成功面值不可为空'
        }
        return false
      } else {
        item.useState = useState
        data = {
          code: 0,
          msg: '修改成功'
        }
        return true
      }
    })
    return data
  },
  //查看密码
  catchPass: config => {
    const { cardId } = JSON.parse(config.body)
    cardsData.some(item => {
      if (item.id === cardId) {
        data = {
          code: 0,
          item,
          msg: '获取成功'
        }
        return true
      } else {
        data = {
          code: 1,
          msg: '获取失败'
        }
        return false
      }
    })
    return data
  },
  //输入补结算
  addbujiesuan: config => {
    const { id, updateBCFaceValue } = JSON.parse(config.body)
    cardsData.some(item => {
      if (item.id === id && isupdateBCFaceValue(updateBCFaceValue)) {
        item.settlementFaceValue += parseInt(updateBCFaceValue)
        item.settlementAmount += parseInt(updateBCFaceValue)
        data = {
          code: 0,
        }
        return true
      } else {
        data: {
          code: 1
          msg: '参数错误'
        }
        return false
      }
    })
    return data
  }
}