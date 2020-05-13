<template>
  <div>
    <svg-icon icon-class="documentation" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'magic4j-docs',
  data() {
    return {
      url: 'http://file.itgacl.com/magic4j-docs'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
