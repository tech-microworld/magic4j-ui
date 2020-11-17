import request from '@/utils/request'

// 查询列表
export function list(query) {
    return request({
        url: '/api/demo/miniappUser/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function get(id) {
    return request({
        url: '/api/demo/miniappUser/' + id,
        method: 'get'
    })
}

// 新增
export function add(data) {
    return request({
        url: '/api/demo/miniappUser',
        method: 'post',
        data: data
    })
}

// 修改
export function update(data) {
    return request({
        url: '/api/demo/miniappUser',
        method: 'put',
        data: data
    })
}

// 删除
export function remove(id) {
    return request({
        url: '/api/demo/miniappUser/' + id,
        method: 'delete'
    })
}

// 导出数据到Excel
export function exportData(data) {
    return request({
        url: '/api/demo/miniappUser/exportData',
        method: 'post',
        data: data
    })
}
