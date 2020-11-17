import request from '@/utils/request'

// 查询日志列表
export function list(query) {
  return request({
    url: '/api/sys/log/list',
    method: 'get',
    params: query
  })
}

// 删除日志
export function remove(logId) {
  return request({
    url: '/api/sys/log/' + logId,
    method: 'delete'
  })
}

// 清空日志
export function clean(query) {
  return request({
    url: '/api/sys/log/clean',
    method: 'delete',
    params: query
  })
}

// 获取模块列表
export function getModuleList() {
  return request({
    url: '/api/sys/log/module/list',
    method: 'get'
  })
}
