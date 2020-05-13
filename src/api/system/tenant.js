import request from '@/utils/request'

// 查询租户列表
export function list(query) {
  return request({
    url: '/api/sys/tenant/list',
    method: 'get',
    params: query
  })
}

// 查询全部租户
export function listAll() {
  return request({
    url: '/api/sys/tenant',
    method: 'get'
  })
}

// 查询详细
export function get(id) {
  return request({
    url: '/api/sys/tenant/' + id,
    method: 'get'
  })
}

// 新增
export function add(data) {
  return request({
    url: '/api/sys/tenant',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/api/sys/tenant',
    method: 'put',
    data: data
  })
}

// 删除
export function remove(id) {
  return request({
    url: '/api/sys/tenant/' + id,
    method: 'delete'
  })
}
