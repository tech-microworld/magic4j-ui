import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/api/sys/config/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/api/sys/config/' + configId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/api/sys/config/key/' + configKey,
    method: 'get'
  })
}

export function getPlatformConfig() {
  return request({
    url: '/api/sys/config/platform',
    method: 'get'
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/api/sys/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/api/sys/config',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function deleteConfig(configId) {
  return request({
    url: '/api/sys/config/' + configId,
    method: 'delete'
  })
}

export function refreshAesSecretKey() {
  return request({
    url: '/api/sys/config/refreshAesSecretKey',
    method: 'post'
  })
}

export function refreshRsaSecretKey() {
  return request({
    url: '/api/sys/config/refreshRsaSecretKey',
    method: 'post'
  })
}

// 安全设置
export function securitySet(data) {
  return request({
    url: '/api/sys/config/security/set',
    method: 'post',
    data: data
  })
}

// 安全设置
export function securityInfo() {
  return request({
    url: '/api/sys/config/security/info',
    method: 'get'
  })
}

export function platformSetting(systemName,systemLogo) {
  const data = {
    systemName,
    systemLogo
  };
  return request({
    url: '/api/sys/config/platformSetting',
    method: 'post',
    params: data
  })
}
