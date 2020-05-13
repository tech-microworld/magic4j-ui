<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!--
        vue控制台报错Duplicate keys detected: 'xxxx'. This may cause an update error.解决方案
        参考：https://blog.csdn.net/Dream_xun/article/details/85064277
        v-for循环里，key值重复就会报这个错，:key="route.path"，如果route.path为空字符串，那么就会出现空的key，从而出现key重复的报错
        把key值改为index（其实就是用索引做key值），就可以避免这个情况
        -->
        <!--<sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />-->
        <sidebar-item v-for="(route,index) in permission_routes" :key="index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
