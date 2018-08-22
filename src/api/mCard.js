import request from '@/utils/request'

export function getCards(data) {
  return request({
    url: '/api/Manage/GetCards',
    method: 'get',
    data
  })
}

export function getAbnormalCards(data) {
  return request({
    url: '/api/Manage/GetAbnormalCards',
    method: 'post',
    data
  })
}

export function getAllCards(data) {
  return request({
    url: '/api/Manage/GetAllCards',
    method: 'post',
    data
  })
}

export function getCardsStatistics(data) {
  return request({
    url: '/api/Manage/GetCardsStatistics',
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

export function updateCardState(data) {
  return request({
    url: '/api/Manage/UpdateCardState',
    method: 'post',
    data
  })
}
export function supplement(data) {
  return request({
    url: '/api/Manage/Supplement',
    method: 'post',
    data
  })
}

export function getPassword(cardId) {
  return request({
    url: '/api/Manage/GetPassword',
    method: 'post',
    params: { cardId }
  })
}
