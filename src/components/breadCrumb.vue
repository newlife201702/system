<style lang="less" scoped>
#breadcrumbContainer{
  padding-bottom:15px;
}
</style>

<template>
    <el-breadcrumb   id="breadcrumbContainer">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" :to="{path:item.path}" >{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>

export default {
  data () {
    return {}
  },
  computed: {
    breadcrumb () {
      return this.$store.getters.getBreadList
    }
  },
  methods: { }
}
</script>
