import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/api/sys/resource/getRouters',
    method: 'get'
  })
}
