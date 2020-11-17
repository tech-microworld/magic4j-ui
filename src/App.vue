<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
  /*去掉百度地图左下角版权信息*/
  .BMap_cpyCtrl
  {
    display:none;
  }
  .anchorBL{
    display:none;
  }
</style>
<script>
export default  {
  name:  'App'
}
</script>
