import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { channelsData } from '../card/channels'
let ConsignUsersData = []
let OrderUsersData = []
let OtherUsersData = []
let UsersData = []
let productData = []
let roleData = []
var data
var count = 100
for (var i = 0; i < count; i++) {
  ConsignUsersData.push(Mock.mock({
    'id': i,
    'realName': '@cname()',
    'email': '@email()',
    'emailConfirmed|1': [true, false],
    'phoneNumber|1': /^1[0-9]{10}$/,
    'phoneNumberConfirmed|1': [true, false],
    'isEnabled|1': [true, false],
    'canConsign': false,
    'balance': '@integer(60, 100)',
  }))
}
OrderUsersData.push({
  'id': 107,
  'realName': '施芳平',
  'email': '1079385523@qq.com',
  'emailConfirmed': true,
  'phoneNumber': 15071314242,
  'phoneNumberConfirmed': true,
  'isEnabled': false,
  'canConsign': false,
  'balance': 2700,
})
for (var i = 108; i < 115; i++) {
  OtherUsersData.push(Mock.mock({
    'id': i,
    'realName': '@cname()',
    'email': '@email()',
    'emailConfirmed|1': [true, false],
    'phoneNumber|1': /^1[0-9]{10}$/,
    'phoneNumberConfirmed|1': [true, false],
    'isEnabled|1': [true, false],
    'canConsign': false,
    'balance': '@integer(60, 100)',
    'roles|1': ['ConsignManage', 'Consign', 'ConsignManage', 'OrderManage', 'SuperManage'],//1=>ConsignManage，2=>Consign，3=>ConsignManage，4=>OrderManage，5=>SuperManage
  }))
}

for (var i = 0; i < count; i++) {
  productData.push(Mock.mock({
    'id': i,
    'name|1': ['产品1', '产品2', '产品3', '产品4', '产品5'],
    'price': '@integer(60, 100)',
    'canOrder|1': [true, false],
  }))
}
roleData.push(
  {
    id: 1,
    name: "ConsignManage"
  },
  {
    id: 2,
    name: "Consign"
  }, {
    id: 3,
    name: "Order"
  }, {
    id: 4,
    name: "OrderManage"
  }, {
    id: 5,
    name: "SuperManage"
  }
)
export default {
  //获取用户数据
  getusersData: config => {
    const { isEnabled, userName, roleName, page = 1, limit = 20 } = JSON.parse(config.body)
    switch (roleName) {
      case 'Consign':
        UsersData = []
        UsersData = ConsignUsersData
        break;
      case 'Order':
        UsersData = []
        UsersData = OrderUsersData
        break;
      case 'Other':
        UsersData = []
        UsersData = OtherUsersData
        break;
    }
    var balances = 0
    UsersData.forEach(item => {
      if (item.phoneNumberConfirmed == false) {
        item.phoneNumber = null
      }
      if (item.emailConfirmed == false) {
        item.email = null
      }
    })
    let mockList = UsersData.filter(item => {
      if (userName && item.realName.indexOf(userName) < 0 && item.email !== userName) return false
      if (JSON.parse(config.body).isEnabled == null) {
        return true
      } else if (JSON.parse(config.body).isEnabled !== null) {
        if (item.isEnabled !== JSON.parse(config.body).isEnabled) return false
      }
      return true
    })
    mockList.forEach(item => {
      balances += item.balance
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: mockList.length,
      item: pageList,
      balances
    }
  },
  //修改可寄售状态
  changeConsignState: config => {
    const { id, canConsign } = JSON.parse(config.body)
    UsersData.some(item => {
      if (item.id === id) {
        item.canConsign = canConsign
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
  //修改账号状态
  changeUserState: config => {
    const { id, isEnabled } = JSON.parse(config.body)
    UsersData.some(item => {
      if (item.id === id) {
        item.isEnabled = isEnabled
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
  //获取收款账号信息
  getAccountInf: config => {
    const { id } = param2Obj(config.url)
    UsersData.some(item => {
      if (item.id === id) {
        data = {
          code: 0,
          item,
          msg: '获取成功'
        }
        return true
      } else {
        data = {
          code: 0,
          item,
          msg: '获取成功'
        }
        return false
      }
    })
    return data
  },

  //寄售用户密价
  getPriceData: config => {
    const { limit = 6, page = 1 } = JSON.parse(config.body)
    const pagelist = channelsData.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      data: pagelist,
      total: channelsData.length,
    }
  },
  //订单用户密价
  getPoductData: config => {
    const { limit = 6, page = 1 } = JSON.parse(config.body)
    const pagelist = productData.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      data: pagelist,
      total: productData.length,
    }
  },
  //修改寄售用户的密价的寄售权限
  UserChannelConsignState: config => {
    const { channelId, userId, canConsign } = JSON.parse(config.body)
    UsersData.some(item => {
      if (item.id === channelId && userId != null) {
        item.canConsign = canConsign
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
  //修改订单用户的密价的寄售权限
  ProductOrderState: config => {
    const { productId, userId, canOrder } = JSON.parse(config.body)
    productData.some(item => {
      if (item.id === productId && userId != null) {
        item.canOrder = canOrder
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
  //API权限

}
export { UsersData, count }