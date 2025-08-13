<template>
  <router-view/>
</template>

<script  lang="ts" setup>
import { onMounted} from 'vue'
onMounted(()=>{
    document.getElementsByTagName('body')[0].style.setProperty('--themeColor', `#1f76cb`);
})
</script>
<style lang="less">

</style>
