import request from '@/utils/request'

// 我要寄售
// 获取寄售通道
export function GetChannels() {
  return request({
    url: '/api/Channel/GetChannels',
    method: 'get'
  })
}

export function getStatistics(data) {
  return request({
    url: '/api/Card/GetStatistics',
    method: 'post',
    data
  })
}

export function getTodayStatistics() {
  return request({
    url: '/api/Card/GetTodayStatistics',
    method: 'get'
  })
}

// 获取卡面值
export function getFaceValues(cid) {
  return request({
    url: '/api/Channel/GetFaceValues',
    method: 'get',
    params: { cid }
  })
}

export function againConsignment(data) {
  return request({
    url: '/api/Card/ConsignmentAgain',
    method: 'post',
    data
  })
}

// 普通寄售提交
export function submitConsignment(data) {
  return request({
    url: '/api/Card/Consignment',
    method: 'post',
    data
  })
}

// 快速寄售提交
export function submitautoConsignment(data) {
  return request({
    url: '/api/Card/AutoConsignment',
    method: 'post',
    data
  })
}

// 通道列表/Channel/Index
export function ChanneData() {
  return request({
    url: '/api/Channel/Index',
    method: 'get'

  })
}

// 获取寄售记录列表
export function GetRecords(data) {
  return request({
    url: '/api/Card/GetRecords',
    method: 'post',
    data
  })
}

// 获取寄售记录导出excel
export function getAllRecords(data) {
  return request({
    url: '/api/Card/GetAllRecords',
    method: 'post',
    data
  })
}
