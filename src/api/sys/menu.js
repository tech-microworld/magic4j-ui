import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/api/sys/resource/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/api/sys/resource/' + menuId,
    method: 'get'
  })
}

// 获取权限树数据
export function getPermsTreeList() {
  return request({
    url: '/api/sys/resource/perm/tree',
    method: 'get'
  })
}


// 查询菜单下拉树结构
export function treeSelect() {
  return request({
    url: '/api/sys/resource/menu/treeSelect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
  return request({
    url: '/api/sys/resource/roleResTreeSelect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/api/sys/resource',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/api/sys/resource',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/api/sys/resource/' + menuId,
    method: 'delete'
  })
}
