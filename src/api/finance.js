import request from '@/utils/request'

export function getSettlement() {
  return request({
    url: '/api/Finance/GetSettlement',
    method: 'get'
  })
}

export function settlement(data) {
  return request({
    url: '/api/Finance/Settlement',
    method: 'post',
    data
  })
}

export function getSettementRecord(data) {
  return request({
    url: '/api/Finance/GetSettementRecord',
    method: 'post',
    data
  })
}

export function getFinances(data) {
  return request({
    url: '/api/Finance/GetFinances',
    method: 'post',
    data
  })
}
