import request from '@/utils/request'

// 查询字典列表
export function list(query) {
  return request({
    url: '/api/sys/dict/list',
    method: 'get',
    params: query
  })
}

// 查询字典详细
export function get(dictId) {
  return request({
    url: '/api/sys/dict/' + dictId,
    method: 'get'
  })
}

// 新增字典
export function add(data) {
  return request({
    url: '/api/sys/dict',
    method: 'post',
    data: data
  })
}

// 修改字典
export function update(data) {
  return request({
    url: '/api/sys/dict',
    method: 'put',
    data: data
  })
}

// 删除字典
export function remove(dictId) {
  return request({
    url: '/api/sys/dict/' + dictId,
    method: 'delete'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/api/sys/dict/type/' + dictType,
    method: 'get'
  })
}
