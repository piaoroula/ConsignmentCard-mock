import request from '@/utils/request'

export function getChannelsPage(data) {
  return request({
    url: '/api/Manage/GetChannelsPage',
    method: 'get',
    data
  })
}
export function ChannelRate(id) {
  return request({
    url: '/api/Manage/ChannelRate',
    method: 'get',
    params: { id }
  })
}
export function updateChannelsRate(data) {
  return request({
    url: '/api/Manage/UpdateChannelRate',
    method: 'post',
    data
  })
}

export function getFaceValueM(cid) {
  return request({
    url: '/api/Manage/GetFaceValueM',
    method: 'get',
    params: { cid }
  })
}

export function updateChannelState(data) {
  return request({
    url: '/api/Manage/UpdateChannelState',
    method: 'post',
    data
  })
}

export function updateFacevalueState(data) {
  return request({
    url: '/api/Manage/UpdateFacevalueState',
    method: 'post',
    data
  })
}

export function addChannel(data) {
  return request({
    url: '/api/Manage/AddChannel',
    method: 'post',
    data
  })
}

export function addfaceValue(data) {
  return request({
    url: '/api/Manage/AddfaceValue',
    method: 'post',
    data
  })
}
