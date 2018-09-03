import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { UsersData } from './users'
let roleData = []
let userRoleList = []
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
//对应用户对应角色
UsersData.forEach(item => {

})
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
    // roleData.some(item => {
    //   if (item.id === id) {
    //     item.
    //   }
    // })
  }
} 