import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/api/sys/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/api/sys/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/api/sys/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/api/sys/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function deletePost(postId) {
  return request({
    url: '/api/sys/post/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(data) {
  return request({
    url: '/api/sys/post/export',
    method: 'post',
    data: data
  })
}
