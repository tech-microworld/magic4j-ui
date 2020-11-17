import request from '@/utils/request'

// 查询文件列表
export function list(query) {
  return request({
    url: '/api/sys/file/list',
    method: 'get',
    params: query
  })
}

export function getCurrStorageType() {
  return request({
    url: '/api/sys/file/storageType',
    method: 'get'
  })
}

export function storageTypeSetting(storageType) {
  const data = {
    storageType
  };
  return request({
    url: '/api/sys/file/storageType/setting',
    method: 'put',
    params: data
  })
}

// 删除
export function remove(id) {
  return request({
    url: '/api/sys/file/' + id,
    method: 'delete'
  })
}

// 文件上传
export function upload(data) {
  return request({
    url: '/api/sys/file/upload',
    method: 'post',
    data: data
  })
}
