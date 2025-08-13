<template>
  <div class="departAdminContainer">
    <span>
      <div style="margin-bottom: 15px;">
        <el-button type="primary" @click="addRootNode"><el-icon>
            <Plus />
          </el-icon> 添加一级部门</el-button>
      </div>
      <el-tree ref="tree" :props="props" :load="loadNode" node-key="id" v-if="reloadTree" lazy draggable
        @node-drag-end="handleDragEnd" :allow-drop="allowDrop" :expand-on-click-node="false">
        <template v-slot:default="{ node, data }">
          <element-tree-line :node="node" :showLabelLine="false">
            <template v-slot:node-label>
              <span class="nodeContainer">
                <span @click="viewNode(node, data)">{{ node.label }}</span>
                <el-icon @click="addNode(node, data)">
                  <CirclePlus />
                </el-icon>
              </span>
            </template>

          </element-tree-line>
        </template>
      </el-tree>
    </span>
    <i>
      <div v-if="hasNode">
        <div class="btnToolsContainer" v-if="actionType !== 'add'">
          <el-button @click="changeStatus(true)"><el-icon>
              <View />
            </el-icon> 详情</el-button>

          <el-button @click="changeStatus(false)"><el-icon>
              <EditPen />
            </el-icon> 编辑</el-button>
          <el-button @click="deleteNode"><el-icon>
              <CloseBold />
            </el-icon>删除</el-button>
          <el-button @click="setNodeStatus">
            <el-icon v-if="currentNode.statusCode === 'DEPARTMENT_STATUS_ENABLE'">
              <Open />
            </el-icon>
            <el-icon v-if="currentNode.statusCode === 'DEPARTMENT_STATUS_DISABLE'">
              <TurnOff />
            </el-icon>
            {{ currentNode.statusCode === 'DEPARTMENT_STATUS_ENABLE' ? '禁用' : '启用' }}</el-button>
        </div>
        <h1 v-if="actionType === 'add'">{{ parentName }}</h1>
        <el-form ref="ruleFormRef"   :disabled="formDisabled" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="编码" prop="departmentCode">
            <el-input v-model="ruleForm.departmentCode" />
          </el-form-item>
          <!-- <el-form-item label="部门类型码" prop="departmentType">
            <el-input v-model="ruleForm.departmentType" />
          </el-form-item> -->


          <el-form-item label="部门类型" prop="typeCode">
            <el-select v-model="ruleForm.typeCode" placeholder="请选择部门">
              <el-option v-for="(item, index) in optionList" :key="'dic' + index" :label="item?.name"
                :value="item?.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="介绍" prop="about">
            <el-input type="textarea" v-model="ruleForm.about" />
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="ruleForm.memo" />
          </el-form-item>
          <el-form-item v-if="!formDisabled">
            <el-button type="primary" @click="submitForm()">
              保存
            </el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- <dialog-view :currentNode="currentNode" v-if="formDisabled"></dialog-view> -->
      </div>
      <span v-if="!hasNode">
        请选择节点获取数据
      </span>


    </i>
  </div>
</template>
<script lang="ts">
import * as api from '@/api'
import { ElMessage,ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { nextTick } from 'vue' // 先引入
interface Tree {
  id: string
  name: string
  leaf?: boolean
}
import { getElementLabelLine } from 'element-tree-line';
import 'element-tree-line/dist/style.css';
import { h, defineComponent } from 'vue';

import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type {
  AllowDropType,
  NodeDropType,
} from 'element-plus/es/components/tree/src/tree.type'

import type {ReqDepartRowData} from '@/type/depart'


export default defineComponent({
  components: { ElementTreeLine: getElementLabelLine(h) },
  data() {
    return {
      // treeData:['CA37C82FC62649A7A9D407072C6B9321'] as any,
      reloadTree: true,
      parentName: "",
      actionType: 'edit',
      hasNode: false,
      formDisabled: true,
      optionList: [],
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
      currentNode: {
        id: "",
        parentId: "",
        name: '',
        departmentCode: '',
        typeCode: '',
        departmentType: '',
        about: "",
        memo: "",
        departmentId: '',
        levelCode: '',
        levelName: '',
        statusName: '',
        statusCode: '',
        isSystem:"1"
      } as any,
      ruleForm: {
        parentId: "",
        name: '',
        departmentCode: '',
        typeCode: '',
        departmentType: '',
        about: "",
        memo: "",
        departmentId: '',
        levelCode: '',
        levelName: '',
        isSystem:"1"
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度2-30', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入部门负责人', trigger: 'blur' },
          { min: 2, max: 30, message: '长度2-30', trigger: 'blur' },
        ],
      }
    };
  },
  mounted() {
    this.getOptionList({code:'DEPARTMENT_TYPE_CODE',businessCode:'BUSINESS_CODE_COMMON'})
  },
  methods: {
    async handleDragEnd(
      draggingNode: Node,
      dropNode: Node,
      dropType: NodeDropType,
      ev: DragEvents
    ) {
      console.log(draggingNode.data)
      console.log(dropNode.data)
      // console.log('tree drag end:', draggingNode && draggingNode.label &&dropNode && dropNode.label, dropType)
      const paramsData:ReqDepartRowData[]=[draggingNode.data as ReqDepartRowData,dropNode.data as ReqDepartRowData]
      const result=await api.department.updateSortNo(paramsData )
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '排序成功', type: 'success' })
      }
      else
      {
        this.refreshTree('root')
      }
    },
    // async resetOrder(startId:string,endId:string){

    //   const reult: any = await api.department.updateSortNo({startId:startId,endId:endId})
    //   if (reult.returnCode === 0 && reult.resultCode === 0) {
    //     ElMessage({ message: '排序成功', type: 'success' })
    //   }
    //   else
    //   {
    //     this.refreshTree('')
    //   }
    // },
    /* 
        设置部门禁用 启用状态
        启用 DEPARTMENT_STATUS_ENABLE
        禁用 DEPARTMENT_STATUS_DISABLE
    */
    async setNodeStatus() {
      const sendJson = {
        id: this.currentNode.id,
        model: {
          statusCode: this.currentNode.statusCode === 'DEPARTMENT_STATUS_ENABLE' ? 'DEPARTMENT_STATUS_DISABLE' : 'DEPARTMENT_STATUS_ENABLE'
        }
      }
      const reult: any = await api.department.updateStatus(sendJson)
      if (reult.returnCode === 0 && reult.resultCode === 0) {
        ElMessage({ message: '状态修改成功', type: 'success' })
        this.currentNode = (await this.getInfo(this.currentNode.id))?.data as any
      }

    },
    /* 
    懒加载载入数据
    */
    async loadNode(node: Node, resolve: (data: Tree[]) => void) {
      // console.log(node, "=======")
      if (node.level === 0) {
        const nodeList = await this.getTreeList('root')
        return resolve(nodeList)
      }

      if (node.level >= 1) {
        const nodeList = await this.getTreeList(node.data.id)
        // console.log(nodeList)
        return resolve(nodeList || [])

      }
    },
    /* 
    切换视图显示状态
    */
    changeStatus(status: boolean) {
      this.actionType = 'edit'
      this.formDisabled = status
    },
    /* 
     调用部门详情
    */
    async getInfo(id: string) {
      return await api.department.getInfo({ id: id })
    },
    async getTreeList(parentId: string) {
      let data: any = (await api.department.list({ parentId: parentId }))?.data
      return data || []
    },
    /* 
    获取数据字典
    */
    async getOptionList(data:{code: string,businessCode:string}) {
      this.optionList = ((await api.dictionary.list(data))?.data as any).map((item: any) => { return { name: item.name, code: item.code } })
    },
    /* 
    查看节点详情
    */
    async viewNode(node: any, data: any) {
      this.actionType = 'edit'
      this.hasNode = true
      this.formDisabled = true
      this.currentNode = (await this.getInfo(data.id))?.data as any
      //由于详情没有返回parentId 需要在目录树中将返回的参数带过来
      this.currentNode.parentId=data.parentId
      this.ruleForm = {
        departmentCode: this.currentNode.departmentCode,
        parentId: this.currentNode.parentId,
        name: this.currentNode.name,
        departmentType: this.currentNode.departmentType,
        typeCode: this.currentNode.typeCode,
        about: this.currentNode.about,
        memo: this.currentNode.memo,
        departmentId: this.currentNode.departmentId,
        levelCode: this.currentNode.levelCode,
        levelName: this.currentNode.levelName,
        isSystem: this.currentNode.isSystem,
      }

    },
    /* 
        激活添加上级部门
         */
    addRootNode() {
      this.resetData()
      this.currentNode.parentId = "root"
      this.ruleForm.parentId = "root"
      this.parentName = "添加一级部门"

    },
    resetData() {
      this.actionType = 'add'
      this.hasNode = true
      this.formDisabled = false

      nextTick(() => {

      this.resetForm()
       
      })

    },
    /* 
      激活   添加子节点
    */
    addNode(node: any, data: any) {
      this.resetData()
     // 由于表单重置需要时间，这里在一个延时处理
      setTimeout(()=>{
     this.currentNode.parentId = data.id
      this.ruleForm.parentId = data.id
      this.parentName = "上级部门:" + data.name},200)


    },
    /**
     * 提交表单
     */
    async submitForm() {

      const formEl: any = this.$refs.ruleFormRef

      await formEl?.validate(async (valid: any, fields: any) => {
        if (valid) {
          if (this.actionType === 'edit') {
            await this.goUpdate({ model: this.ruleForm, id: this.currentNode.id })
          }
          else {
            await this.goAdd(this.ruleForm)
          }
          this.resetForm()
          this.refreshTree(this.currentNode.parentId)
        } else {
          console.log('error submit!', fields)
        }
      })
    },
    /* 
     更新节点 
     */
    async goUpdate(data: any) {
      const result: any = await api.department.update(data)
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '子节点更新成功', type: 'success' })
      }
    },
    async goAdd(data: any) {
      const result: any = await api.department.add(data)
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '节点添加成功', type: 'success' })
      }
    },
    /* 
    重置表单数据
    */
    resetForm() {
      this.ruleForm = {
        departmentCode: "",
        parentId:  "",
        name:  "",
        departmentType:  "",
        typeCode:  "",
        about:  "",
        memo: "",
        departmentId:  "",
        levelCode: "",
        levelName:  "",
        isSystem:  "1",
      }
      const formEl: any = this.$refs.ruleFormRef

      formEl?.resetFields()
    },
    /* 
    删除节点，并局部刷新目录树
    */
    async deleteNode() {
      ElMessageBox.confirm('是否确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await api.department.del({ id: this.currentNode.id })
        this.hasNode = false
        this.refreshTree(this.currentNode.parentId)
      })
    },

    /**
     * 单独刷新节点
     * guid: 当前节点的父级唯一标识节点
     */
    refreshTree(guid: string) {
      if (!(guid==='root' || guid)) {
        let myobj: any = this.$refs.tree
        let node = myobj.getNode(guid);
        if (node) {
          node.loaded = false;    //告诉组件这个节点需要加载
          node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
        }
      }
      else {
        //重新载入刷新上级部门
        this.reloadTree = false
        setTimeout(() => {
          this.reloadTree = true
        }, 200)
      }


    },
    allowDrop(draggingNode: any, dropNode: any, type: any) {
      // console.log(draggingNode.level, dropNode.level)
      //注掉的是同级拖拽
      if (draggingNode.level === dropNode.level) {
        return type === 'prev' || type === 'next'
      } else {
        // 不同级进行处理
        return false
      }
    }

  }
});
</script>
<style>
.el-tree-node__content {
  padding-top: 5px;
  padding-bottom: 5px;
  height: auto;
}
</style>
<style lang="less" >
.nodeContainer {
  display: block;

  &>i {
    margin-left: 5px;
    display: none;
    top: 2px;
    // color: red;
  }
}

.nodeContainer:hover {
  &>i {
    // color: red;
    display: inline-block;
  }
}

.departAdminContainer {

  position: relative;

  &>span {
    height: calc(100vh - 130px);
    border-right: 1px solid #e4e3e3;
    width: 320px;
    left: 0;
    top: 0;
    position: absolute;
    display: block;
    overflow: auto;

  }

  &>i {

    margin-left: 340px;
    display: block;

    &>div {
      &>h1 {
        text-indent: 10px;
        line-height: 2.5;
        font-size: 16px;
        color: #666;
        font-weight: normal;
        border-bottom: 1px solid #e4e3e3;
        margin-bottom: 20px;
      }

      &>.btnToolsContainer {
        border-bottom: 1px solid #edeff3;
        border-top: 1px solid #edeff3;
        padding-bottom: 10px;
        padding-top: 10px;
        margin-bottom: 20px;

        &>button {
          &>span {
            &>i {
              margin-right: 5px
            }
          }

        }
      }

      &>form {

        max-width: 600px;
      }
    }


  }
}
</style>
