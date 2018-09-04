import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { UsersData } from './users'
let roleData = []
let userRoleList = []
var data
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
  //获取角色列表
  getRoleList: config => {
    return {
      code: 0,
      roleData,
      msg: '获取成功'
    }
  },

  //修改角色
  changeRole: config => {
    const { id, roles } = JSON.parse(config.body)
    UsersData.some(item => {
      if (item.id === id) {
        item.roles = roles
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