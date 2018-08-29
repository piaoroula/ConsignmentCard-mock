import request from '@/utils/request'

export function getFinances(data) {
  return request({
    url: '/api/Manage/GetFinances',
    method: 'post',
    data
  })
}
