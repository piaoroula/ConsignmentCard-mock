import request from '@/utils/request'

export function getProducts(data) {
  return request({
    url: '/api/Order/GetProducts',
    method: 'post',
    data
  })
}

export function addOrder(data) {
  return request({
    url: '/api/Order/AddOrder',
    method: 'post',
    data
  })
}

export function getOrders(data) {
  return request({
    url: '/api/Order/GetOrders',
    method: 'post',
    data
  })
}

export function cancelOrder(data) {
  return request({
    url: '/api/Order/CancelOrder',
    method: 'post',
    data
  })
}