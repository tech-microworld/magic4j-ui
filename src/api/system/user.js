import request from '@/utils/request'
import { praseStrEmpty,param2String } from "@/utils/commonUtil";
import { rsaEncrypt,aesEncrypt } from '@/utils/encrypt' //加密

// 分页查询用户列表
export function listUser(query) {
  return request({
    url: '/api/sys/user/list',
    method: 'get',
    params: query
  })
}

//分页查询租户用户
export function tenantUserList(query) {
  return request({
    url: '/api/sys/user/tenant/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/api/sys/user/edit/info?id=' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/sys/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/api/sys/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: '/api/sys/user/' + userId,
    method: 'delete'
  })
}

// 禁用用户
export function forbidUser(userId) {
  return request({
    url: '/api/sys/user/forbid/' + userId,
    method: 'put'
  })
}

// 启用用户
export function enableUser(userId) {
  return request({
    url: '/api/sys/user/enable/' + userId,
    method: 'put'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password,rsaPublicKey) {
  const data = {
    userId,
    password
  };
  let paramStr = param2String(data);
  //对于form表单提交方式，约定以encryptParam为Key进行提交
  let params = {encryptParam: rsaEncrypt(paramStr,rsaPublicKey)};//RSA加密
  return request({
    url: '/api/sys/user/resetPwd',
    method: 'put',
    params: params
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/api/sys/user',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/api/sys/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/api/sys/user',
    method: 'put',
    data: data
  })
}

// 修改用户密码
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: '/api/sys/user/updatePwd',
    method: 'put',
    params: data
  })
}

// 修改用户密码
export function encryptUpdateUserPwd(oldPassword, newPassword,rsaPublicKey) {
  const data = {
    oldPassword,
    newPassword
  };
  let paramStr = param2String(data);
  //对于form表单提交方式，约定以encryptParam为Key进行提交
  let params = {encryptParam: rsaEncrypt(paramStr,rsaPublicKey)};//RSA加密
  return request({
    url: '/api/sys/user/updatePwd',
    method: 'put',
    params: params
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/api/storage/upload',
    method: 'post',
    data: data
  })
}

export function getSecretKey() {
  return request({
    url: '/api/tool/secret/key',
    method: 'get'
  })
}
