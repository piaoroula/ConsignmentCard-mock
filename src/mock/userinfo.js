import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { isvalidatephone, validateURL } from "@/utils/validate";
let userinfoData = {}
let apiInfo = {}
var data
var userdata = [
  userinfoData = {
    name: '施芳平',
    balance: 27,
    email: '1079385523@qq.com',
    // phoneNumber: '',
    // code: '',
    // selectAcount: [],
    // institution: '',
    // accountBank: '',
    // account: '',
    realName: '施芳平'
  },
  apiInfo = {
    id: 1001,
    secretKey: '9256aB9d-E796-47D9-3ff4-c29E6DeF71E7',
    callbackUrl: ''
  }
]

export default {
  //获取账号信息
  getUserInf: config => {
    return {
      code: 0,
      data: { userinfoData, apiInfo }
    }
  },
  //发送短信验证码
  sendCodeMessage: config => {
    const { phone } = JSON.parse(config.body)
    if (isvalidatephone(phone)) {
      return {
        code: 0,
        msg: '短信发送成功，请查看'
      }
    } else {
      return {
        code: 1,
        msg: '请输入正确的手机号，如：15071314242'
      }
    }
  },
  //提交保存账号信息
  submitAcount: config => {
    const { account, institution, accountBank, phone } = JSON.parse(config.body)
    if (account != undefined && institution != undefined && accountBank != undefined && phone != undefined) {
      return {
        code: 0,
        msg: '寄售成功'
      }
    } else {
      return {
        code: 1,
        msg: '收款账户、机构名称、开户行不能为空'
      }
    }
  },
  //判断用户是否有API权限
  UpdateCallbackUrlData: config => {
    const { callbackUrl } = JSON.parse(config.body)
    if (validateURL(callbackUrl)) {
      return {
        code: 0,
        msg: '提交成功'
      }
    } else {
      return {
        code: 1,
        msg: '请输入有效的回调地址，如:http://www.baidu.com'
      }
    }
  }
}