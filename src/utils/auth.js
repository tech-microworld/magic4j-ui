import request from '@/utils/request'

const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';

export function getToken() {
  return localStorage.getItem(accessTokenKey)
}

export function getRefreshToken() {
  return localStorage.getItem(refreshTokenKey)
}

export function setToken(accessToken,refreshToken) {
  //Cookie使用时需要注意个数及大小限制:https://blog.csdn.net/proglovercn/article/details/45514705
  //localStorage.setItem(accessTokenKey, token) //使用Cookies存储会存在大小限制问题，改成localStorage存储可以存储，Chrome浏览器中localStorage最大5120kb，即5M
  storeToken(accessTokenKey,accessToken);
  storeToken(refreshTokenKey,refreshToken);
}

export function removeToken() {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(accessTokenKey + '_expiration');
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem(refreshTokenKey + '_expiration');
}

/**
 * 解析服务端返回的jwt Token
 * JWT全称为json web token,他的本质是一个对JSON对象加密后的字符串，
 * 当服务器认证通过后一个包含用户信息的josn对象，返给用户，
 * 典型的JWT由三个部分组成，每一个部分由点（.）分隔，这样就构成JWT，
 　　例子如下：header.payload.signature
 * @param token
 */
export function parseJwtToken(token) {
  let parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT must have 3 parts');
  }
  let header = token.split('.')[0];
  let payload = token.split('.')[1];
  let signature = token.split('.')[2];
  let jwtToken = {};
  //处理可能会出现的：Uncaught DOMException: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.
  //原因是编码的字符串中含有“-”或者“_”,正确的base64编码的字符串是：包含A-Z，a-z，0-9，+，/，=字符，所有解析payload之前先把这些特殊符号替换掉
  let newPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
  jwtToken.header = JSON.parse(decodeURIComponent(escape(window.atob(header))));
  jwtToken.payload = JSON.parse(decodeURIComponent(escape(window.atob(newPayload))));
  jwtToken.signature = decodeURIComponent(escape(signature));
  return jwtToken;
}

/**
 * 判断是不是jwtToken
 * @param token
 * @returns {boolean}
 */
export function isJwtToken(token) {
  let isJwtToken = true;
  let parts = token.split('.');
  if (parts.length !== 3) {
    isJwtToken = false;
  }
  return isJwtToken;
}

/**
 * 判断token是否有效
 * @param tokenKey
 * @returns {*|boolean}
 */
export function isTokenValid() {
  let token = localStorage.getItem(accessTokenKey);
  if(isJwtToken(token)){
    let clientExpiration = localStorage.getItem(accessTokenKey + '_expiration');
    return clientExpiration && clientExpiration > new Date().valueOf();
  }else {
    return true;//非jwtToken没有过期时间
  }
}

export function storeToken(tokenKey,token) {
  localStorage.setItem(tokenKey, token);
  if(isJwtToken(token)){
    let tokenData = parseJwtToken(token).payload;
    let issuedAt = tokenData.iat;
    let expTime = tokenData.exp;
    if (issuedAt && expTime) {
      let ttl = expTime - issuedAt;
      if (ttl > 0) {
        let clientExpiration = new Date().valueOf() + ttl*1000;//计算token客户端过期时间
        localStorage.setItem(tokenKey + '_expiration', clientExpiration);
      }
    }
  }
}

/**
 * 刷新Token
 */
export function refreshToken(){
  const refreshToken = getRefreshToken();
  const data = {
    refreshToken
  };
 return request({
    url:'/api/auth/token/refresh',
    method: 'post',
    params: data
  });
}
