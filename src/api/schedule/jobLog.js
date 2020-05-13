import request from '@/utils/request'

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url: '/api/schedule/jobLog/list',
    method: 'get',
    params: query
  })
}

// 删除调度日志
export function deleteJobLog(jobLogId) {
  return request({
    url: '/api/schedule/jobLog/' + jobLogId,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: '/api/schedule/jobLog/clean',
    method: 'delete'
  })
}
