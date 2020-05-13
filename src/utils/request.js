import axios from 'axios'
import { Notification, MessageBox, Message,Loading } from 'element-ui'
import store from '@/store'
import {getToken,isTokenValid,refreshToken,setToken,removeToken} from '@/utils/auth'
import Vue from 'vue'
/*是否正在刷新的标志*/
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requestRetryQueue = [];

let loading;      //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loading = Vue.prototype.$loading({
    //spinner: 'el-icon-loading',
    lock: true,
    //text: 'Loading……',
    target: document.querySelector('.loading-area')//设置加载动画区域
  })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时(60秒)
  timeout: 60000
});

// request拦截器
/*service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 给每一个请求添加Authorization请求头，内容就是loginToken，用于服务端登录验证校验
    }
    return config
  },
  error => {
    console.log(error);
    return Promise.reject(error)
  }
);*/

// request拦截器
service.interceptors.request.use(
  request => {
    let loginToken = getToken();
    if(loginToken){//判断用户是否已经登录
      request.headers.Authorization = loginToken; // 给每一个请求添加Authorization请求头，内容是loginToken，用于服务端登录验证
      if(!isTokenValid() && request.url !== '/api/auth/token/refresh') { //“/sys/auth/token/refresh”是刷新token的接口，只有当token过期且不是请求刷新token的接口才会进入
        //判断当前是否正在刷新，如果不是，将刷新的标志置为true并请求刷新token；如果是，将请求存储到requestRetryQueue数组中
        if(!isRefreshing) {
          isRefreshing = true;
          refreshToken().then(res => {//调用refreshToken接口刷新Token
            let accessToken = res.data.token;
            let refreshToken = res.data.refreshToken;
            setToken(accessToken,refreshToken);
            return accessToken;
          }).then((token)=>{
            showFullScreenLoading();
            requestRetryQueue.forEach(cb =>cb(token));
            isRefreshing = false;
            // 执行完成后，清空队列
            requestRetryQueue = []
          }).catch(res => {
            console.error('refresh token error: ', res)
            removeToken();//移除本地无效Token
          });
        }
        const retryOriginalRequest = new Promise((resolve) => {
          requestRetryQueue.push((token) => {
            // 因为headers中的token是旧的，所以刷新token后要将新token传进来
            request.headers.Authorization = token;
            // 将请求挂起
            resolve(request)
          })
        });
        return retryOriginalRequest
      }else {
        if(request.url !== '/api/login/user' && request.url !== '/api/sys/resource/getRouters' && request.url !=='/api/sys/config/platform'){
          showFullScreenLoading();
        }
        return request
      }
    }else {
      //如果没有登录直接返回请求
      return request
    }
  },
  error => {
    console.log(error);
    return Promise.reject(error)
  }
);

// 响应拦截器
/*service.interceptors.response.use(res => {
    const code = res.data.code;
    if (code === 401) {//服务端返回401，表示jwt Token已经过期
      const config = res.config;//res.config就是原请求的配置，但这个是已经处理过了的，config.url已经带上了baseUrl，因此重试时需要去掉，同时token也是旧的，需要刷新下
      console.log(config.url+"发起请求服务端检测accessToken超时");
      if(!isRefreshing){
        return refreshToken().then(res => {
          let accessToken = res.data.token;
          let refreshToken = res.data.refreshToken;
          setToken(accessToken,refreshToken);
          config.baseURL = ''; //config.url已经带上了baseUrl，重试时需要去掉
          config.headers['Authorization'] = accessToken;//token是旧的，需要刷新下
          console.log('已经刷新了token，将requestRetryQueue队列中的所有请求进行重试，length',requestRetryQueue.length);
          requestRetryQueue.forEach(cb => cb(accessToken)); // 已经刷新了token，将所有队列中的请求进行重试
          requestRetryQueue = []; // 执行完成后，清空队列
          return service(config)
        }).catch(res => {
          console.error('refreshToken error =>', res);
          MessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }).finally(() => {
          isRefreshing = false
        })
      }else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requestRetryQueue.push((token) => {
            config.baseURL = ''; //config.url已经带上了baseUrl，重试时需要去掉
            config.headers['Authorization'] = token;//token是旧的，需要刷新下
            resolve(service(config))
          })
        })
      }
    } else if (code !== 0) {
      Notification.error({
        title: res.data.msg
      });
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);*/

// 响应拦截器
service.interceptors.response.use(res => {
    tryHideFullScreenLoading();
    const code = res.data.code;
    if (code === 401) {//服务端返回401，表示jwt Token已经过期
       MessageBox.confirm(
         '登录状态已过期，请重新登录',
         '系统提示',
         {
           showCancelButton:false,
           confirmButtonText: '重新登录',
           type: 'warning'
         }
       ).then(() => {
         store.dispatch('LogOut').then(() => {
           location.reload() // 为了重新实例化vue-router对象 避免bug
         })
       })
    } else if (code !== 0) {
      Notification.error({
        title: res.data.msg
      });
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    tryHideFullScreenLoading();
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);

export default service
