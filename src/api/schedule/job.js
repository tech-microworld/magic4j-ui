import request from '@/utils/request'

// 查询定时任务调度列表
export function listJob(query) {
  return request({
    url: '/api/schedule/job/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return request({
    url: '/api/schedule/job/' + jobId,
    method: 'get'
  })
}

// 新增定时任务调度
export function addJob(data) {
  return request({
    url: '/api/schedule/job',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob(data) {
  return request({
    url: '/api/schedule/job',
    method: 'put',
    data: data
  })
}

// 删除定时任务调度
export function deleteJob(jobId) {
  return request({
    url: '/api/schedule/job/' + jobId,
    method: 'delete'
  })
}

// 执行定时任务
export function runJob(jobId) {
  return request({
    url: '/api/schedule/job/run/'+ jobId,
    method: 'put'
  })
}

//暂停定时任务
export function pauseJob(jobId) {
  return request({
    url: '/api/schedule/job/pause/'+ jobId,
    method: 'put'
  })
}

//恢复定时任务
export function resumeJob(jobId) {
  return request({
    url: '/api/schedule/job/resume/'+ jobId,
    method: 'put'
  })
}
