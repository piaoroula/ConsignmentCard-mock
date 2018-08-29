import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let recordData = []
const count = 5
for (var i = 0; i < count; i++) {
  recordData.push(Mock.mock({
    'id': i,//编号
    'name|1': ['移动充值卡', '联通充值卡', '电信全国充值卡'],
    'faceValue|1': [20, 30, 40],
    'settlementFaceValue': '',
    'settlementAmount': '',
    'useState|1': [0, 1, 2, 3, 4, 5, 6],// 卡状态 随机选取 1 个元素,0=>待处理,1=>已取出,2=>处理中,3=>成功,4=>失败,5=>可疑,6=>可疑核查中,7=>未知
    'addTime': new Date(new Date().getTime() - 1 * 5 * 1000),
    'callbackTime': '@now()',
    'cardNumber': '@natural(10000)',
    // 'channelId|1': [0, 1, 2],//0=>移动充值卡,1=>联通充值卡,2=>电信全国充值卡//mock不好设计，此数据省

    // 'faceValueId': '@natural(10000)',
    'remark': '@csentence()',
    'userTime': 5,
  }))
}
export default {
  //寄售详情的数据
  getrecordData: config => {
    const { name, beginTime, endTime, FaceValueId, useState, statisticsState, CardNumber, limit = 20, page = 1 } = JSON.parse(config.body)
    let mockList = recordData.filter(item => {
      if (name && item.name != name) return false
      if (FaceValueId && item.faceValue != FaceValueId) return false
      if (statisticsState && item.statisticsState != statisticsState) return false
      if (useState && item.useState != useState) return false
      if (beginTime && item.addTime < beginTime) return false
      if (endTime && item.addTime > endTime) return false
      if (CardNumber && item.CardNumber != CardNumber) return false
      return true
    })
    var allUseStateArry = []
    var useStateArry = []
    var inconformityCount = 0
    var successCount
    var failCount
    var processCount
    var faceValueTotal = 0
    var settlementFaceValueTotal = 0
    var settlementAmountTotal = 0
    mockList.forEach(item => {
      faceValueTotal += item.faceValue
      settlementFaceValueTotal += item.settlementFaceValue
      settlementAmountTotal += item.settlementAmount
      allUseStateArry.push(item.useState)
    })
    console.log(allUseStateArry)
    for (var i = 0; i < allUseStateArry.length; i++) {
      // //如果卡状态为3=》成功
      if (allUseStateArry.indexOf(3) >= 0) {
        if (allUseStateArry[i] === 3) {
          useStateArry.push(allUseStateArry[i])
          successCount = useStateArry.length
          console.log(successCount)
        }
      } else {
        successCount = 0
      }

      //如果卡状态为4=》失败
      if (allUseStateArry.indexOf(4) >= 0) {
        if (allUseStateArry[i] === 4) {
          useStateArry.push(allUseStateArry[i])
          failCount = useStateArry.length
          console.log(failCount)
        }
      } else {
        failCount = 0
      }

      //如果卡状态为2=》处理中
      if (allUseStateArry.indexOf(2) >= 0) {
        if (allUseStateArry[i] === 2) {
          useStateArry.push(allUseStateArry[i])
          processCount = useStateArry.length
          console.log(processCount)
        }
      } else {
        processCount = 0
      }

    }
    // //如果卡状态为3=》成功
    // if (allUseStateArry.indexOf(3) >= 0) {
    //   if (item.useState === 3) {
    //     useStateArry.push(item.useState)
    //     successCount = useStateArry.length
    //     console.log(successCount)
    //   }
    // } else {
    //   successCount = 0
    // }
    // //如果卡状态为4=》失败
    // if (allUseStateArry.indexOf(4) >= 0) {
    //   if (item.useState === 4) {
    //     useStateArry.push(item.useState)
    //     failCount = useStateArry.length
    //     console.log(failCount)
    //   }
    // } else {
    //   failCount = 0
    // }
    // //如果卡状态为2=》处理中
    // if (allUseStateArry.indexOf(2) >= 0) {
    //   if (item.useState === 2) {
    //     useStateArry.push(item.useState)
    //     processCount = useStateArry.length
    //     console.log(processCount)
    //   }
    // } else {
    //   processCount = 0
    // }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 0,
      total: mockList.length, //线报总数
      items: pageList,     //每一页显示的数据
      data: { successCount, failCount, processCount, faceValueTotal, settlementFaceValueTotal, settlementAmountTotal },
    }
  },
  //计算面值不符，3=>成功，4=>失败,2=>处理中的张数
  // getCountData: config => {
  //   const { name, beginTime, endTime, FaceValueId, useState, statisticsState, CardNumber, limit = 20, page = 1 } = JSON.parse(config.body)
  //   let mockList = recordData.filter(item => {
  //     if (name && item.name != name) return false
  //     if (FaceValueId && item.faceValue != FaceValueId) return false
  //     if (statisticsState && item.statisticsState != statisticsState) return false
  //     if (useState && item.useState != useState) return false
  //     if (beginTime && item.addTime < beginTime) return false
  //     if (endTime && item.addTime > endTime) return false
  //     if (CardNumber && item.CardNumber != CardNumber) return false
  //     return true
  //   })
  //   var useStateArry = []
  //   var allUseStateArry = []
  //   var inconformityCount = 0
  //   var successCount
  //   var failCount
  //   var processCount
  //   var faceValueTotal = 0
  //   var settlementFaceValueTotal = 0
  //   var settlementAmountTotal = 0
  //   mockList.forEach(item => {
  //     faceValueTotal += item.faceValue
  //     settlementFaceValueTotal += item.settlementFaceValue
  //     settlementAmountTotal += item.settlementAmount
  //     allUseStateArry.push(item.useState)
  //     //如果卡状态为3=》成功
  //     if (allUseStateArry.indexOf(3) > 0) {
  //       if (item.useState === 3) {
  //         useStateArry.push(item.useState)
  //         successCount = useStateArry.length
  //       }
  //     } else {
  //       successCount = 0
  //     }
  //     //如果卡状态为4=》失败
  //     if (allUseStateArry.indexOf(4) > 0) {
  //       if (item.useState === 4) {
  //         useStateArry.push(item.useState)
  //         failCount = useStateArry.length
  //       }
  //     } else {
  //       failCount = 0
  //     }
  //     //如果卡状态为2=》处理中
  //     if (allUseStateArry.indexOf(2) > 0) {
  //       if (item.useState === 2) {
  //         useStateArry.push(item.useState)
  //         processCount = useStateArry.length
  //       }
  //     } else {
  //       processCount = 0
  //     }
  //   });
  //   return {
  //     code: 0,
  //     data: { successCount, failCount, processCount, faceValueTotal, settlementFaceValueTotal, settlementAmountTotal },
  //     total: mockList.length
  //   }
  // }
}