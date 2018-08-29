import request from '@/utils/request'

export function getSettlementAccount(id) {
  return request({
    url: '/api/Manage/GetSettlementAccount',
    method: 'get',
    params: { id }
  })
}

export function getSettlementPage(data) {
  return request({
    url: '/api/Manage/GetSettlementPage',
    method: 'post',
    data
  })
}

export function getSettlementAccounts(data) {
  return request({
    url: '/api/Manage/GetSettlementAccounts',
    method: 'post',
    data
  })
}

export function updateSettlementState(data) {
  return request({
    url: '/api/Manage/UpdateSettlementState',
    method: 'post',
    data
  })
}
