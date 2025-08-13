<template>
    {{ dialogTitle }}
      <el-dialog
        v-model="dialogVisible"
        :title="getTypeByName(dialogTitle) !== '-' ? '选择' + '【' + getTypeByName(dialogTitle) + '】要素 - ' + getTitleName(dialogTitle) : '选择' + ' - ' + dialogTitle"
        append-to-body
        width="1500"
        style="height:500px">

         <el-button icon="Plus" @click="addNewData">增加参数</el-button>
         <el-button @click="handleChoseList">确定</el-button>
         <el-table :data="dataList" border style="width: 100%;margin-top: 15px;max-width:1400px">
                                <el-table-column label="参数名称" >
                                    <template #default="scope">
                                        <el-input v-model="scope.row.name" placeholder="请输入" />
                                    </template>
                                </el-table-column>
                                  <el-table-column label="参数类型">
                                    <template #default="scope">
                                         <el-select  placeholder="Select" style="width: 240px" v-model="scope.row.dataTypeCode"
                                         @change="changeTypeCode">
                                             <el-option label="文本" value="TASK_INOUTPUT_DATA_TYPE_CODE_TEXT" />
                                             <el-option label="文件" value="TASK_INOUTPUT_DATA_TYPE_CODE_FILE" />
                                             <el-option label="图片" value="TASK_INOUTPUT_DATA_TYPE_CODE_IMAGE" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="参数值">
                                    <template #default="scope" v-if="selectType === '1'">
                                        <el-input v-model="scope.row.dataTypeValue" placeholder="请输入"/>
                                    </template>
                                    <template #default="scope" v-if="selectType === '2'">
                                              <el-upload
                                                    class="avatar-uploader"
                                                    action="uploadUrl"
                                                    :show-file-list="false"
                                                    :on-success="handleAvatarSuccess"
                                                    :before-upload="beforeAvatarUpload"
                                                >
                                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                                                </el-upload>
                                    </template>
                                    <template #default="scope" v-if="selectType === '3'">
                                             <el-upload
                                                    class="avatar-uploader"
                                                    action="uploadUrl"
                                                    :show-file-list="false"
                                                    :on-success="handleAvatarSuccess"
                                                    :before-upload="beforeAvatarUpload"
                                                >
                                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                                                </el-upload>
                                    </template>
                                </el-table-column>
                                <el-table-column label="密级" width="340">    
                                         <template #default="scope">
                                                 <el-radio-group v-model="scope.row.securityLevelCode">
                                                        <el-radio :label="item.code" v-for="(item, index) in secretLevelList" :key="'security' + index">
                                                            <img :src="getIcoByName(item.name)" alt="">
                                                    </el-radio>
                                                </el-radio-group>
                                         </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                      <template #default="scope">
                                            <el-button icon="Minus" @click="removeData(scope.$index)">删除</el-button>
                                      </template>
                                </el-table-column>
                            </el-table>
    </el-dialog>
</template>


<script lang="ts" setup>

import { ref, reactive, defineEmits, nextTick,onMounted } from 'vue'
import lazyTree from './lazyTree.vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { toRefs, shallowRef, computed } from 'vue'
import * as api from '@/api'
// 异步组件导入
import { defineAsyncComponent } from 'vue'
import dicOptions from '@/libs/common/dicOptions'
import { getIcoByName } from '@/libs/utils'

const emit = defineEmits(['updateData'])
const dialogVisible = ref(false)
const chooseList = ref<any>([])
const selectType = ref();
const { secretLevelList } = dicOptions([{ code: 'SECRET_LEVEL', businessCode: 'BUSINESS_CODE_COMMON' }])
const uploadUrl = ref<String>()
const fileUrl = ref<String>()
const imageUrl = ref<String>()

const props = defineProps({
    dialogTitle: String,
    listModule: String,
    listMethod: String,
    listLoadKeyField: String,
    listLoadValueField: String,
    listQueryParam: {},
})


const {
   dialogTitle,
   listModule,
   listMethod,
   listLoadKeyField,
   listLoadValueField,
   listQueryParam
}= toRefs(props)

const dataList = ref<any>([]);

const titleDictionaryLib = ref<any>([
    { titleType: '任务', dialogTitle: '输入参数' },
    { titleType: '任务', dialogTitle: '输出参数' },
])

const getTypeByName = (myTitle: string | undefined) => {   
    let myTitleType = '-'
    titleDictionaryLib.value.map((item: any) => {
        if (item.dialogTitle === myTitle) {
            myTitleType = item.titleType
        }
    })
    return myTitleType
}

const getTitleName = (myTitle: string | undefined) => {
    console.log(myTitle)
    return myTitle;
}


const openDialog = async (arr: string[], action: string): Promise<void> => {
    nextTick(() => {
        dialogVisible.value = true
    })
}
const closeDialog = (): void => {
    dialogVisible.value = false
}


//主动暴露组件属性
defineExpose({
    openDialog,
    closeDialog
})


const getNodeInfo = async (): Promise<void> => {
    let params = {}
    if (listQueryParam?.value) {
            params = listQueryParam.value
    }

    dataList.value =  (await api[listModule?.value][listMethod?.value](params)).data;
}


const addNewData = () =>{
    dataList.value.push({
        name: '',
        dataTypeCode: '',
        dataTypeValue: '',
        securityLevelCode: ''
    })
}

const removeData = (item: any) =>{
    dataList.value.splice(item,1);
}

const handleChoseList = () => {
    emit('updateData', dataList.value || [])
}

const changeTypeCode = (value: any) => {
    if(value === 'TASK_INOUTPUT_DATA_TYPE_CODE_TEXT'){
        selectType.value  = "1";
    }
    if(value === 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE'){
        selectType.value = "2";
    }
    if(value === 'TASK_INOUTPUT_DATA_TYPE_CODE_IMAGE'){
        selectType.value = "3";
    }
}


onMounted(() => {
  const baseURL = process.env.NODE_ENV === 'development' ? '/api' : ''
  uploadUrl.value = baseURL + '/common/web/file/upload2Mongodb.do'
  fileUrl.value =  baseURL + '/common/web/file/upload2Mongodb.do'
})


</script>

<style lang="less">
.lazyCascadeGridContainer {
    .el-dialog__body {
        padding: 0;
    }

    .searchContainer {
        text-align: right;

        .el-input {
            width: 200px;
        }

        .el-input__wrapper {
            border-radius: 15px;
        }
    }

    .treeCascadeGridFootContainer {
        & > i {
            float: right;
        }

        & > span {
            display: block;
            text-align: left;
            margin-right: 120px;
            font-size: 14px;

            & > span {
                display: inline-block;
                padding: 4px 8px 4px 8px;
                border: 1px solid #f0efef;
                border-radius: 5px;
                position: relative;
                margin-right: 10px;
                font-size: 14px;

                & > i {
                    background-color: #e15454;
                    color: #fff;
                    height: 12px;
                    width: 12px;
                    display: inline-block;
                    border-radius: 6px;
                    position: absolute;
                    line-height: 12px;
                    text-align: center;
                    top: -6px;
                    right: -6px;
                    cursor: pointer;
                }
            }

            & > i {
                display: inline-block;
                padding: 4px 8px 4px 8px;
                color: #e15454;
            }
        }
    }

    .myLazyCascadeTableContainer {
        width: 100%;
        max-height: calc(100% - 75px);
    }
}

.layoutlazyTreeCascadeGridContainer {
    border-top: 1px solid #f0efef;
    border-bottom: 1px solid #f0efef;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 10px;

    & > i {
        position: absolute;
        left: 0px;
        top: 0px;
        display: inline-block;
        width: 260px;
        border-right: 1px solid #f0efef;
        height: calc(100% - 20px);
        padding-right: 5px;
        overflow: auto;
        padding: 10px;
    }

    & > span {
        margin-left: 280px;
        display: flex;
        flex-direction: column;
        height: calc(100%);
        padding: 0px 15px 0px 15px;
    }

    display: block;
    height: calc(50vh);
}
</style>