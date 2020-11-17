import request from '@/utils/request'

// 查询列表
export function list(query) {
    return request({
        url: '/api/sys/cnArea/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function get(id) {
    return request({
        url: '/api/sys/cnArea/' + id,
        method: 'get'
    })
}

// 新增
export function add(data) {
    return request({
        url: '/api/sys/cnArea',
        method: 'post',
        data: data
    })
}

// 修改
export function update(data) {
    return request({
        url: '/api/sys/cnArea',
        method: 'put',
        data: data
    })
}

// 删除
export function remove(id) {
    return request({
        url: '/api/sys/cnArea/' + id,
        method: 'delete'
    })
}

// 导出数据到Excel
export function exportData(data) {
    return request({
        url: '/api/sys/cnArea/exportData',
        method: 'post',
        data: data
    })
}

// 查询区域树列表
export function listAreaTree(query) {
  return request({
    url: '/api/sys/cnArea/tree',
    method: 'get',
    params: query
  })
}

// 查询区域下拉树结构
export function treeSelect(query) {
  return request({
    url: '/api/sys/cnArea/treeSelect',
    method: 'get',
    params: query
  })
}
