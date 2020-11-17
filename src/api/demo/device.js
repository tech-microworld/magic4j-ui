import request from '@/utils/request'

// 查询列表
export function list(query) {
    return request({
        url: '/api/demo/device/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function get(id) {
    return request({
        url: '/api/demo/device/' + id,
        method: 'get'
    })
}

// 新增
export function add(data) {
    return request({
        url: '/api/demo/device',
        method: 'post',
        data: data
    })
}

// 修改
export function update(data) {
    return request({
        url: '/api/demo/device',
        method: 'put',
        data: data
    })
}

// 删除
export function remove(id) {
    return request({
        url: '/api/demo/device/' + id,
        method: 'delete'
    })
}

// 导出数据到Excel
export function exportData(data) {
    return request({
        url: '/api/demo/device/exportData',
        method: 'post',
        data: data
    })
}

//根据坐标位置查询设备列表
export function locationList(query) {
  return request({
    url: '/api/demo/device/location/list',
    method: 'get',
    params: query
  })
}
