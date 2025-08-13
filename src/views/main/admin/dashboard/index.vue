<template>
<div>
    dashboard
    <choose-member-dialog ref="chooseMember" @updateData="updateData"></choose-member-dialog>
    <el-button type="primary" @click="openDialog" >打开</el-button>
</div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import chooseMemberDialog from '@/components/common/chooseMemberDialog.vue';
const chooseMember=ref()
const openDialog=()=>{
    // chooseMember.value.openDialog([],'multiple')
    chooseMember.value.openDialog([],'single')
}
const updateData=(arr:string[])=>{

    console.log(arr)

}
</script>

<style lang="less">

</style>
