import request from '@/utils/request'

export function addProduct(data) {
  return request({
    url: '/api/Product/AddProduct',
    method: 'post',
    data
  })
}

export function getProducts(data) {
  return request({
    url: '/api/Product/GetProducts',
    method: 'post',
    data
  })
}

export function getOrders(data) {
  return request({
    url: '/api/Product/getOrders',
    method: 'post',
    data
  })
}

export function editState(data) {
  return request({
    url: '/api/Product/UpdateState',
    method: 'post',
    data
  })
}

export function updateOrderState(data) {
  return request({
    url: '/api/Product/UpdateOrderState',
    method: 'post',
    data
  })
}

export function updateOrderPriority(data) {
  return request({
    url: '/api/Product/UpdateOrderPriority',
    method: 'post',
    data
  })
}

export function editPrivate(data) {
  return request({
    url: '/api/Product/UpdatePrivateState',
    method: 'post',
    data
  })
}

export function editProduct(data) {
  return request({
    url: '/api/Product/UpdateProduct',
    method: 'post',
    data
  })
}
