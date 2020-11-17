import request from '@/utils/request'

// 查询用户轨迹统计数据
export function accessMap() {
  return request({
    url: '/api/access/areaMap',
    method: 'get'
  })
}

// 查询登录统计数据
export function loginStatistic() {
  return request({
    url: '/api/login/statistic',
    method: 'get'
  })
}
