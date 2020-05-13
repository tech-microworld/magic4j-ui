<template>
  <el-container>
    <el-row>
      <el-col :span="24">
        <el-main>
          <article class="markdown-body mt-4">
            <p>    一直都想按照自己的想法去开发一个基于SpringBoot的javaWeb快速开发平台(基础开发框架)，经过一个多月日夜奋战，利用业余时间，从0到1，终于按照自己的想法去实现了一个基于SpringBoot的java快速开发平台，我将其命名为<span style='color:red'>【magic4j】</span>，寓意<span style='color:red'>【神奇的、魔法般的Java开发平台】</span>。</p>
            <h1>一、项目简介</h1>
            <p>    magic4j是一个<span style='color:red'>【前后端分离】</span>快速开发平台，支持<span style='color:red'>【多租户】</span>，基于 Spring Boot、mybatisPlus 和 Vue 开发，可以用于所有的Web应用程序，内置了许多通用性的功能模块，如用户管理、角色管理、资源管理等。magic4j旨在帮助中小型企业及个人实现项目的快速开发和交付。</p>
            <h1>二、主要特性</h1>
            <ul>
              <li>采用业界主流的<span style='color:red'>【前后端分离】</span>的开发模式，前端开源框架采用<span style='color:red'>【vue-element-admin】</span> (基于 Vue、Element-UI)</li>
              <li>后端采用<span style='color:red'>【Springboot+Mybatis-Plus+jwt+redis】</span>等主流的技术栈实现，并对其基础的<span style='color:red'>【缓存组件】、【文件存储组件】</span>做了高度的封装，提供了多种实现，做到开箱即用，多种实现方式灵活切换。</li>
              <li>基于Mybatis-Plus实现的功能强大的<span style='color:red'>【代码生成器】</span>、根据自定义模板生成Entity、Mapper、Mppper.xml、DTO、Service、Controller代码，生成的文件直接到相应的业务模块，省去文件拷贝步骤，灵活可控。</li>
              <li>采用全新的思路自主实现了基于<span style='color:red'>【RBAC模型的权限管理】</span>，实现了<span style='color:red'>【菜单权限】、【功能权限】、【数据权限】</span>的细致化访问权限控制。</li>
              <li>支持<span style='color:red'>【多租户】</span>，租户数据隔离方案为：<span style='color:red'>【共享数据库、Schema、数据表】</span>，通过在表中增加<span style='color:red'>【tenant_id】字段+【多租户SQL解析器】</span>优雅地实现租户数据隔离。同时支持<span style='color:red'>【一键开启或者关闭】</span>多租户模式</li>
              <li>使用<span style='color:red'>【Mybatis拦截器】</span>优雅的实现了数据权限，根据角色所拥有的数据权限范围在执行SQL查询过程中动态拼接过滤条件，实现数据过滤。同时支持<span style='color:red'>【一键开启或者关闭】</span>数据权限控制</li>
              <li>支持<span style='color:red'>【jwt和自定义Token】</span>两种用户登录Token认证，系统默认使用的Jwt进行ToKen认证，可以通过修改application.yml配置文件切换Token的认证方式，根据情况自由选择。</li>
              <li>自带了<span style='color:red'>【缓存组件】</span>，提供基于注解和API两种使用方式，基于<span style='color:red'>【Redis和caffeine】两种实现</span>方式，可以通过修改application.yml配置文件切换缓存的实现，Redis的方式又支持【单机和集群】两种模式。这样可以做到开发阶段使用caffeine、测试阶段使用Redis单机，生产使用Redis集群三种方式自由切换。</li>
              <li>支持<span style='color:red'>【本地】、【sftp】、【FastDFS】</span>以及第三方<span style='color:red'>【阿里云OSS】、【腾讯云COS】、【七牛云存储】</span>多种文件存储服务，可动态任意切换。</li>
              <li>注重<span style='color:red'>【数据安全】</span>传输，提供了<span style='color:red'>【RSA和AES】两种加密</span>方式，客户端通过调用RestFul API获取到RSA加密公钥和AES加密密钥，将客户端的敏感数据加密后传输。同时提供了通用的数据解密过滤器，在请求到达业务处理接口之前，将数据解密成明文，免去了接口手动处理解密步骤，专注业务实现逻辑。</li>
              <li>注重<span style='color:red'>【密码安全】</span>传输，对于登录、修改密码、重置密码这些涉及到密码传输的操作都使用了RSA加密后再传输到服务端，避免了密码直接明文暴露传输。</li>
              <li>支持<span style='color:red'>【自定义密码验证规则】</span>，可以灵活设置【密码长度】、至少包含的【大小写字母】、【数字】、【特殊字符】等组成规则，增加密码的复杂度</li>
              <li>使用<span style='color:red'>【ThreadLocal管理登录用户信息】</span>实现随用随取，可以在任何方法中很方便的获取用户信息</li>
              <li>注重日志信息收集，系统日志细分为<span style='color:red'>【登录日志】和【操作日志】</span>，详细记录的了用户的操作行为和登录行为，通过系统日志可以很清新地知道用户对系统进行的相关操作。</li>
              <li>整合Quartz做<span style='color:red'>【分布式定时任务】</span>，并记录了任务<span style='color:red'>【执行日志】</span>，任务执行情况一目了然。</li>
              <li>使用<span style='color:red'>【拦截器实现防止重复提交】</span>，保证一些关键性操作的幂等性。</li>
              <li>完善的<span style='color:red'>【用户】、【角色】、【菜单】、【组织机构】、【岗位】、【数据字典】、【系统配置】</span>等基础功能。</li>
              <li>接口访问统一采用标准的restful方式，集成swagger-ui在线接口文档，支持跨域请求调用，服务端采用主流的cros作为跨域解决方案。</li>
              <li>支持<span style='color:red'>【MySQL】和【Postgresql】</span>两种主流数据库，其他主流的数据库Oracle和SQLServer理论上也都支持。</li>
              <li>强大的底层封装，提供了自定义注解<span style='color:red'>Auth、AutoIdempotent、Encrypt、Log、DataScope</span>，优雅地实现了访问权限验证、方法幂等性校验，数据统一解密处理、AOP日志记录，数据权限控制。</li>
              <li>自定义了<span style='color:red'>【cloudStorage-spring-boot-starter】、【fastdfs-spring-boot-starter】、【jsch-spring-boot-starter】</span>，方便以starter快速集成oss、cos、kodo、fastdfs、jsch。</li>
              <li>基于Maven构建的多模块项目，支持分环境(test、prod)打包，预设了大量的环境变量，便于运维人员部署时动态替换相关配置(如DB连接地址、用户名、密码)</li>
            </ul>
            <h1 id="三内置功能">三、内置功能</h1>
            <ol>
              <li>用户管理：管理系统用户，实现对用户增删改查、批量禁用和启用，重置密码</li>
              <li>部门管理：管理系统组织机构（公司、部门），树结构展现，支持数据权限。</li>
              <li>岗位管理：管理系统用户所属担任职务。</li>
              <li>菜单管理：管理系统菜单，树结构展现。</li>
              <li>角色管理：角色菜单权限、操作权限分配、设置角色按部门进行数据范围权限划分。</li>
              <li>租户管理：管理合作的租户信息</li>
              <li>字典管理：对系统中经常使用的一些较为固定的数据进行维护。</li>
              <li>安全设置：用于帐号锁定设置和配置密码验证规则。</li>
              <li>配置管理：对系统动态配置常用参数进行维护。</li>
              <li>操作日志：记录用户对系统进行的增删改行为，支持按操作用户、业务模块、操作结果、操作时间多维度组合的数据查询。</li>
              <li>登录日志：记录用户的登录操作，支持按登录用户、登录结果、登录时间多维度组合的数据查询。</li>
              <li>定时任务：在线添加、修改、删除、执行、暂停、恢复调度任务。</li>
              <li>调度日志：记录调度任务的执行情况。</li>
              <li>文件管理：文件上传、下载、管理上传文件。</li>
              <li>表单构建器：拖动表单元素生成相应的HTML代码。</li>
            </ol>
            <h1 id="四技术选型">四、技术选型</h1>
            <h2 id="41后端">4.1、后端</h2>
            <ul>
              <li>基础框架：Spring Boot 2.2.6.RELEASE</li>
              <li>持久化框架：Mybatis-Plus_3.3.1.tmp</li>
              <li>数据库：MySQL/Postgresql</li>
              <li>安全框架：权限拦截器+自定义注解实现类似Shiro的细粒度权限控制</li>
              <li>JwtToken生成与解析：jjwt_0.9.0</li>
              <li>数据库连接池：Hikari，一款非常强大,高效,并且号称“史上最快连接池”。在SpringBoot2.0之后,采用的默认数据库连接池就是Hikari</li>
              <li>缓存框架：redis+caffeine</li>
              <li>文件存储：oss、cos、kodo、fastdfs、sftp</li>
              <li>定时任务：quartz</li>
              <li>日志框架：logback</li>
              <li>工具包：hutool</li>
              <li>其他：fastjson，jsch, lombok等。</li>
            </ul>
            <h2 id="42前端">4.2、前端</h2>
            <ul>
              <li>Vue2.6.10</li>
              <li>Vuex</li>
              <li>Vue Router</li>
              <li>Axios</li>
              <li>ElementUI2.13.0</li>
              <li>vue-element-admin(UI框架)</li>
              <li>jsencrypt(Rsa加密)</li>
              <li>crypto-js(Aes加密、sha256加密、md5加密、base64编码)</li>
            </ul>
            <h2 id="43开发环境">4.3、开发环境</h2>
            <ul>
              <li>JDK：JDK 1.8</li>
              <li>IDE： IntelliJ IDEA，安装lombok插件、MybatisX快速开发插件。MybatisX 是一款基于 IDEA 的快速开发插件，为效率而生。<br />
                安装方法：打开 IDEA，进入 File -&gt; Settings -&gt; Plugins -&gt; Browse Repositories，输入 mybatisx 搜索并安装。</li>
              <li>依赖管理：Maven3.x</li>
              <li>数据库：MySQL5.7或者MySQL8</li>
              <li>缓存：如果使用的是Redis缓存，则需要安装Redis</li>
              <li>文件服务器：如果将文件上传到FastDFS，则需要搭建FastDFS文件服务器</li>
              <li>Nginx：负载均衡以及静态资源访问服务器，部署magic-ui前端项目需要使用到nginx</li>
            </ul>
            <h1 id="五项目结构">五、项目结构</h1>
            <h2 id="51magic4j服务端">5.1、magic4j服务端</h2>
            <p><img src="http://blog.itgacl.com/upload/2020/5/magic4j%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84_20200508151434-1d6489b84816478db4f352cfea4fefd5.png" alt="" /></p>
            <h2 id="52magic4j前端">5.2、magic4j前端</h2>
            <p><img src="http://blog.itgacl.com/upload/2020/4/image-8bc29c9e6c624378b2bc578dad0a8ad3.png" alt="" /></p>
            <h1 id="六在线体验">六、在线体验</h1>
            <h2 id="61演示地址">6.1、演示地址</h2>
            <p><a href="http://magic4j.itgacl.com" target="_blank" style="color: blue">http://magic4j.itgacl.com</a><br />
              帐号：magic4j<br />
              密码：123456</p>
            <h1 id="七二次开发">七、二次开发</h1>
            <p>项目地址：<a href="https://gitee.com/gacl/magic4j" target="_blank" style="color: blue"><a href="https://gitee.com/gacl/magic4j">https://gitee.com/gacl/magic4j</a></a><br />
              技术文档：<a href="http://file.itgacl.com/magic4j-docs" target="_blank" style="color: blue"><a href="http://file.itgacl.com/magic4j-docs">http://file.itgacl.com/magic4j-docs</a></a></p>
            <h1 id="八技术交流">八、技术交流</h1>
            <p>qq交流群：938107164</p>
            <h1 id="九商务合作">九、商务合作</h1>
            <h2 id="91关于作者">9.1、关于作者</h2>
            <p>本人有8年的软件开发经验，擅长分布式JavaWeb应用，物联网应用，微信公众号、微信小程序的应用开发，擅长JavaEE开发中常用的SpringBoot、SpringCloud、Netty、JFinal、motan、shiro、MyBatis、MyBatisPlus、Spring-data-jpa框架，有基于motan和SpringCloud实现的微服务化的项目实战经验。有基于SpringBoot+Netty的物联网项目开发实战经验。</p>
            <p>技术博客：<a href="http://blog.itgacl.com" target="_blank" style="color: blue">http://blog.itgacl.com</a></p>
            <h2 id="92联系作者">9.2、联系作者</h2>
            <p>手机号：13822290843</p>
            <p>邮箱：290603672@qq.com</p>
            <p>
              <img src="../assets/image/wxQrCode.jpg" style="width: 200px;height: 200px"/>
              <img src="../assets/image/qqQrCode.jpg" style="width: 200px;height: 200px"/>
            </p>
          </article>
        </el-main>
      </el-col>
    </el-row>
  </el-container>

</template>

<script>

export default {
  name: 'Index',
  components: {

  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    line-height: 30px;
    border-radius: 4px;
    margin: 10px;
  }

  article pre code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace !important;
  }

  /* 目录链接划过样式 */
  #catalogs p a:hover {
    color: #dc3545 !important;
  }

  /* 目录被激活的时候的样式 */
  .catalog-active {
    color: #dc3545 !important;
  }

  /* 鼠标滑过复制按钮的时候的颜色 */
  .btn-clipboard:hover {
    opacity: 1;
    background: #007bff !important;
  }

  /* 文章中的标题标签划过的颜色 */
  #content article h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover {
    cursor: pointer;
    color: #dc3545 !important;
  }

  /* 阅读进度的进度条颜色 */
  #readProgress .read-progress-bar {
    background: #dc3545 !important;
    height: 0.1875rem;
  }
</style>
