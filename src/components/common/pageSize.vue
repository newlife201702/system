<template>
    <span>
      每页显示：
      <el-button-group>
        <el-button :type="action===item?'primary':''" :plain="action===item" v-for="(item,index) in pageList" @click="setPage(item)" :key="'page'+index">{{item}}</el-button>
      </el-button-group>
    </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { defineEmits } from 'vue'
const emit = defineEmits(["changePageSize"]);
const action = ref<number>(10)
const pageList=ref<number[]>([10,20,50,100])
const setPage=(item:number):void=>{
action.value=item
emit("changePageSize",item)
}
</script>

<style scoped>

</style>
