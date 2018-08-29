import request from '@/utils/request'

export function getSettlement() {
  return request({
    url: '/api/Finance/GetSettlement',
    method: 'get'
  })
}

export function getUsers(data) {
  return request({
    url: '/api/Manage/GetUsers',
    method: 'post',
    data
  })
}

export function addAccount(data) {
  return request({
    url: '/api/Manage/AddAccount',
    method: 'post',
    data
  })
}

export function deleteAccount(data) {
  return request({
    url: '/api/Manage/DeleteAccount',
    method: 'post',
    data
  })
}

export function getRoles() {
  return request({
    url: '/api/Manage/GetRoles',
    method: 'get'
  })
}

export function getRoleByID(userid) {
  return request({
    url: '/api/Manage/GetRoleById',
    method: 'get',
    params: { userid }
  })
}

export function getAccounts(userid) {
  return request({
    url: '/api/Manage/GetAccounts',
    method: 'get',
    params: { userid }
  })
}

export function getverification(id) {
  return request({
    url: '/api/Account/GetIdentification',
    method: 'post',
    params: { id }
  })
}

export function GetBalances(data) {
  return request({
    url: '/api/Manage/GetBalances',
    method: 'post',
    data
  })
}

export function updateUserState(data) {
  return request({
    url: '/api/Manage/UpdateUserState',
    method: 'post',
    data
  })
}

export function updateUserRole(data) {
  return request({
    url: '/api/Manage/UpdateUserRole',
    method: 'post',
    data
  })
}

export function updateConsignState(data) {
  return request({
    url: '/api/Manage/UpdateConsignState',
    method: 'post',
    data
  })
}

export function getChannelsPage(data) {
  return request({
    url: '/api/Manage/GetChannelsPage',
    method: 'post',
    data
  })
}

export function getChannels() {
  return request({
    url: '/api/Manage/getChannels',
    method: 'get'
  })
}

export function getFaceValues(cid) {
  return request({
    url: '/api/Manage/GetFaceValues',
    method: 'get',
    params: { cid }
  })
}

export function getUserPrice(data) {
  return request({
    url: '/api/Manage/getUserPrice',
    method: 'post',
    data
  })
}

export function updateUserChannelConsignState(data) {
  return request({
    url: '/api/Manage/UpdateUserChannelConsignState',
    method: 'post',
    data
  })
}

export function updateUserBuyRate(data) {
  return request({
    url: '/api/Manage/UpdateUserBuyRate',
    method: 'post',
    data
  })
}

export function getApiInfo(data) {
  return request({
    url: '/api/Manage/GetApiInfo',
    method: 'post',
    data
  })
}

export function updateApiState(data) {
  return request({
    url: '/api/Manage/UpdateApiState',
    method: 'post',
    data
  })
}

export function addApi(data) {
  return request({
    url: '/api/Manage/AddApi',
    method: 'post',
    data
  })
}
