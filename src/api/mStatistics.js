import request from '@/utils/request'

export function getStatistics(data) {
  return request({
    url: '/api/Card/GetMStatistics',
    method: 'post',
    data
  })
}

export function getUStatistics(data) {
  return request({
    url: '/api/Card/GetUStatistics',
    method: 'post',
    data
  })
}
