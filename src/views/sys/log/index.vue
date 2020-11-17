<template >
  <!--
  有三级路由嵌套的情况下，还要手动在二级目录的根文件下添加一个 <router-view>
  原则上有多少级路由嵌套就需要多少个<router-view>
  参考：https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E5%A4%9A%E7%BA%A7%E7%9B%AE%E5%BD%95-%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1
  -->
  <router-view />
</template>
