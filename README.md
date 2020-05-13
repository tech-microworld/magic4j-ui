# magic4j的前端项目

## 一、技术选型
- Vue 2.6.10
- Axios
- ElementUI 2.13.0
- vue-element-admin(UI框架)
- jsencrypt(Rsa加密)
- crypto-js(Aes加密、sha256加密、md5加密、base64编码)

## 二、二次开发

```bash
# 克隆项目
git clone https://gitee.com/gacl/magic4j-ui.git

# 进入项目目录
cd magic4j-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 三、打包发布
### 3.1、构建测试环境
npm run build:stage
#### 3.2、构建生产环境
npm run build:prod
### 3.3、nginx部署
在nginx的配置文件nginx.conf中添加以下配置
```
upstream magic4jServer {
   server 172.16.0.17:8888 weight=1; #应用程序部署的服务器地址
}

server {
        server_name magic4j.itgacl.com; #网站访问域名
        listen   80; #端口号设置80，这样通过域名访问时就不再需要再域名后面加上:端口号了
        index    index.html; #网站首页页面名称
        access_log logs/magic4j.itgacl.com.access.log; #配置记录访问日志的文件
        error_log  logs/magic4j.itgacl.com.error.log; #配置记录错误日志的文件

        # magic4j-ui部署
        location / {
            root /data/htdocs/magic4j-ui; #配置magic4j-ui静态文件的所在目录
            try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }

        # 配置API接口服务器访问路径
        location /stage/ {
            proxy_pass http://magic4jServer/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

}
```
## 四、参考资料

### element-ui文档 
https://element.eleme.cn/#/zh-CN/component/installation

### vue-element-admin文档
https://panjiachen.github.io/vue-element-admin-site/zh/

### axios如何利用promise无痛刷新token
>https://segmentfault.com/a/1190000020210980
>https://segmentfault.com/a/1190000020986592
