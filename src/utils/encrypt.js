import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import CryptoJS from 'crypto-js';

/**
 * Rsa 公钥加密
 * @param data
 * @param publicKey
 * @returns {string}
 */
export function rsaEncrypt(data,publicKey) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(data) // 对需要加密的数据进行加密
}

/**
 * Rsa 私钥解密
 * @param data
 * @param privateKey
 * @returns {string}
 */
export function rsaDecrypt(data,privateKey) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(data)
}

/**
 * AES加密
 * @param data
 * @param aesKey
 * @returns {string}
 */
export function aesEncrypt(data,aesKey) {
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const srcs = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return encrypted.toString();
}

/**
 * AES解密
 * @param data
 * @param aesKey
 */
export function aesDecrypt(data,aesKey) {
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const decrypt = CryptoJS.AES.decrypt(data, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * sha256 加密
 * @param data
 */
export function sha256(data) {
  return CryptoJS.SHA256(data).toString();
}

/**
 * MD5加密
 * @param data
 */
export function md5(data) {
  return CryptoJS.MD5(data).toString();
}

/**
 * Base64编码
 * @param data
 * @returns {string}
 */
export function base64EnCode(data) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

/**
 * Base64解码
 * @param data
 * @returns {string}
 */
export function base64DeCode(data) {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
}
