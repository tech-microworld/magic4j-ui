import request from '@/utils/request'

// 查询列表
export function listAuthRes() {
  return request({
    url: '/api/sys/resource/authRes/list',
    method: 'get'
  })
}

// 修改
export function update(data) {
  return request({
    url: '/api/sys/resource',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/api/sys/resource/' + id,
    method: 'delete'
  })
}

export function refreshAuthRes() {
  return request({
    url: '/api/sys/resource/refreshAuthRes',
    method: 'post'
  })
}
