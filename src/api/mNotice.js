import request from '@/utils/request'

export function getNoticesPage(data) {
  return request({
    url: '/api/Article/GetNoticesPage',
    method: 'get',
    params: { data }
  })
}

export function addNotice(data) {
  return request({
    url: '/api/Manage/AddNotice',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/api/Manage/UpdateNotice',
    method: 'post',
    data
  })
}

export function deleteNotice(id) {
  return request({
    url: '/api/Manage/DeleteNotice',
    method: 'post',
    data: { id }
  })
}

export function uploadFile() {
  return request({
    url: '/api/Manage/UploadFile',
    method: 'post'
  })
}
