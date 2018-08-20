import request from '@/utils/request'

//修改密码
export function changepwd(data) {
  return request({
    url: '/api/Account/ChangePwd',
    method: 'post',
    data
  })
}

//修改密码
export function uploadFile() {
  return request({
    url: '/api/Account/UploadFile',
    method: 'post'
  })
}

// 账号管理
// 获取账号信息
export function getMainIndex() {
  return request({
    url: '/api/Account/GetMainIndex',
    method: 'get'
  })
}

// 账号管理
//获取账号信息
export function GetUser() {
  return request({
    url: '/api/Account/GetUser',
    method: 'get',
  })
}
//提交账号信息
export function userinfo(data) {
  return request({
    url: '/api/Account/Submit',
    method: 'post',
    data
  })
}
//发送短信验证码
export function SendSmsCode(phone) {
  return request({
    url: '/api/Account/SendSmsCode',
    method: 'post',
    data: { phone }
  })
}

//提交保存账号信息
export function SubmitAcount(data) {
  return request({
    url: '/api/Account/Submit',
    method: 'post',
    data
  })
}
//判断用户是否有API权限
export function UpdateCallbackUrl(callbackUrl) {
  return request({
    url: '/api/Account/UpdateCallbackUrl',
    method: 'post',
    data: { callbackUrl }
  })
}

export function getTodayBalances() {
  return request({
    url: '/api/Account/GetTodayBalances',
    method: 'get'
  })
}
