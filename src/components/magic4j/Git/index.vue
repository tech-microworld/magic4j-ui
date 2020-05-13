<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'magic4jGit',
  data() {
    return {
      url: 'https://gitee.com/gacl/magic4j'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
