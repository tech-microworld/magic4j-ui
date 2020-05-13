import request from '@/utils/request'

// 查询部门树列表
export function listDeptTree(query) {
  return request({
    url: '/api/sys/dept/tree',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/api/sys/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeSelect() {
  return request({
    url: '/api/sys/dept/treeSelect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeSelect(roleId) {
  return request({
    url: '/api/sys/dept/roleDeptTreeSelect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/api/sys/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/api/sys/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function deleteDept(deptId) {
  return request({
    url: '/api/sys/dept/' + deptId,
    method: 'delete'
  })
}
