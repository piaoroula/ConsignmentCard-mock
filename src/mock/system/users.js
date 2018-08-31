import Mock from 'mockjs'
import { param2Obj } from '@/utils'
let ConsignUsersData = []
let OrderUsersData = []
let OtherUsersData = []
let UsersData = []
var data
var count = 100
for (var i = 0; i < count; i++) {
  ConsignUsersData.push(Mock.mock({
    'id': i,
    'realName': '@cname()',
    'email': '@email()',
    'emailConfirmed|1': [true, false],
    'phoneNumber': null,
    'phoneNumberConfirmed|1': [true, false],
    'isEnabled|1': [true, false],
    'canConsign|1': [true, false],
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
  'isEnabled': true,
  'canConsign': true,
  'balance': 2700,
})
OtherUsersData.push({
  'id': 145,
  'realName': '王五',
  'email': '1123456523@qq.com',
  'emailConfirmed': true,
  'phoneNumber': 15071314242,
  'phoneNumberConfirmed': true,
  'isEnabled': true,
  'canConsign': true,
  'balance': 50,
})


export default {
  getusersData: config => {
    const { isEnabled, userName, roleName, page = 1, limit = 20 } = JSON.parse(config.body)
    switch (roleName) {
      case 'Consign':
        UsersData = []
        UsersData = ConsignUsersData
        console.log(UsersData)
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
    UsersData.forEach(item => {
      if (item.phoneNumberConfirmed == true) {
        item.phoneNumber = 15071314242
      } else {
        item.phoneNumber = null
      }
      if (item.emailConfirmed == false) {
        item.email = null
      }
    })
    let mockList = UsersData.filter(item => {
      if (userName && item.realName.indexOf(userName) < 0 && item.email !== userName) return false

      if (isEnabled && item.isEnabled !== isEnabled) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: mockList.length,
      item: pageList
    }
  }


} 