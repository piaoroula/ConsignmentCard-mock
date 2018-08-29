import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { userinfoData } from '../userinfo.js'
let infoData = []
let settlementAccounts = []
var data
infoData = {
  accountId: 101,
  balance: userinfoData.balance,
}
settlementAccounts = [
  {
    id: 0,
    account: 15071314242,
    accountBank: '招商银行',
    institution: '支付宝',
    name: userinfoData.name
  }
]
export default {
  //获取收款账号信息
  getAccounts: config => {
    return {
      code: 0,
      data: { infoData, settlementAccounts }
    }
  },
  //申请提现
  submitAccount: config => {
    const { balance, selectAccount } = JSON.parse(config.body)
    if (balance != null && selectAccount != undefined) {
      data = {
        code: 0,
        msg: '提现成功'
      }
    } else {
      data = {
        code: 1,
        msg: '参数错误'
      }
    }
    return data
  }
}
export { settlementAccounts }