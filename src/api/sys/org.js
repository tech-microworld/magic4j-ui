import request from '@/utils/request'

// 查询列表
export function list(query) {
    return request({
        url: '/api/sys/org/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function get(id) {
    return request({
        url: '/api/sys/org/' + id,
        method: 'get'
    })
}

// 新增
export function add(data) {
    return request({
        url: '/api/sys/org',
        method: 'post',
        data: data
    })
}

// 修改
export function update(data) {
    return request({
        url: '/api/sys/org',
        method: 'put',
        data: data
    })
}

// 删除
export function remove(id) {
    return request({
        url: '/api/sys/org/' + id,
        method: 'delete'
    })
}

// 查询树列表
export function listTree(query) {
    return request({
        url: '/api/sys/org/treeList',
        method: 'get',
        params: query
    })
}

// 查询下拉树结构
export function treeSelect(query) {
    return request({
        url: '/api/sys/org/treeSelect',
        method: 'get',
        params: query
    })
}
