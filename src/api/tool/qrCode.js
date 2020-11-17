import request from '@/utils/request'

// 生成二维码
export function createQrCode(param) {
  return request({
    url: '/api/comm/createQrCode',
    method: 'get',
    params: param
  })
}
