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
    privates: true,
    state: true,
    canConsign: false,
    editFlag: false
  },
  {
    id: 1,
    name: "联通充值卡",
    buyRate: 30,
    privates: true,
    state: true,
    canConsign: true,
    editFlag: false
  },
  {
    id: 2,
    name: "电信全国充值卡",
    buyRate: 40,
    privates: false,
    state: false,
    canConsign: false,
    editFlag: false
  }
)
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
    var maxId = idArry.sort(function (a, b) {
      return b - a;
    })[0];
    var nameArry = []
    //过滤重复提交的通道名称
    channelsData.forEach(item => {
      nameArry.push(item.name)
    })
    if (nameArry.indexOf(name) < 0) {
      if (name != null && buyRate != null && privates != null) {
        var addData = {
          id: maxId + 1,
          name: name,
          buyRate: buyRate,
          privates: privates,
        }
        channelsData.splice(0, 0, addData)
        data = {
          code: 0,
          msg: '添加通道成功'
        }
        // return true
      } else {
        data = {
          code: 1,
          msg: '参数错误'
        }
      }
    } else {
      data = {
        msg: '已存在此通道，无需再添加'
      }
    }
    return data
  },
  //获取费率
  getBuyRate: config => {
    const { id } = param2Obj(config.url)
    channelsData.some(item => {
      if (item.id === JSON.parse(id)) {
        data = {
          code: 0,
          item: item,
          msg: '获取成功'
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
  //修改费率
  handelBuyRate: config => {
    const { id, buyRate } = JSON.parse(config.body)
    if (buyRate != "") {
      channelsData.some(k => {
        if (k.id === id) {
          k.buyRate = buyRate
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
export { channelsData }