<template>
    <el-dialog v-model="dialogFormVisible" title="" width="860px">
        <div class="stepDialogContainer">
            <span>
                <div style="margin-bottom: 15px;">
                    <el-button type="primary" @click="addRootNode"><el-icon>
                            <Plus />
                        </el-icon> 添加根</el-button>
                </div>
                <el-tree ref="tree" :props="props" :load="loadNode" node-key="id" v-if="reloadTree" lazy
                    :expand-on-click-node="false">
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
                        <el-button @click="changeStatus(false)"><el-icon>
                                <EditPen />
                            </el-icon> 编辑</el-button>
                        <el-button @click="deleteNode"><el-icon>
                                <CloseBold />
                            </el-icon>删除</el-button>

                    </div>
                    <h1 v-if="actionType === 'add'">{{ parentName }}</h1>
                    <el-form ref="ruleFormRef" :disabled="formDisabled" @submit.prevent :model="ruleForm" :rules="rules" label-width="100px"
                        status-icon>
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="ruleForm.name" />
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

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="freshTree()">
                    完成
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import * as api from '@/api'
import { ElMessage } from 'element-plus'
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




export default defineComponent({
    components: { ElementTreeLine: getElementLabelLine(h) },
    props: ['metaDataTable', 'projectId'],
    data() {
        return {
            dialogFormVisible: false,
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
                id: '',
                metaDataTable: '',
                name: '',
                parentId: '',
                projectId: ''
            } as any,
            ruleForm: {
                metaDataTable: '',
                name: '',
                parentId: '',
                projectId: ''
            } as any,
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度2-30', trigger: 'blur' },
                ]
            }
        };
    },
    //   mounted() {},
    methods: {
        freshTree() {
            this.dialogFormVisible = false
            this.$emit('freshTree')
        },
        openDialog() {
            this.dialogFormVisible = true
        },
        /* 
        懒加载载入数据
        */
        async loadNode(node: Node, resolve: (data: Tree[]) => void) {
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
        async getTreeList(parentId: string) {
            const params = {
                parentId: parentId,
                projectId: this.projectId,
                metaDataTable: this.metaDataTable
            }
            let data: any = (await api.commonWf.metaRelaList(params))?.data
            return data || []
        },

        /* 
        查看节点详情
        */
        async viewNode(node: any, data: any) {
            this.actionType = 'edit'
            this.hasNode = true
            this.formDisabled = true

            //由于详情没有返回parentId 需要在目录树中将返回的参数带过来
            this.currentNode = data
            this.ruleForm = {
                metaDataTable: this.metaDataTable,
                name: data.name,
                parentId: node.parentId,
                id: data.id,
                projectId: this.projectId
            }

        },
        /* 
            激活添加上级节点
             */
        addRootNode() {
            this.resetData()

            this.parentName = "添加根"
            setTimeout(() => {
                this.ruleForm = {
                    metaDataTable: this.metaDataTable,
                    name: '',
                    parentId: "",
                    projectId: this.projectId
                }
            }, 200)



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
            setTimeout(() => {
                this.currentNode.parentId = data.id
                this.ruleForm = {
                    metaDataTable: this.metaDataTable,
                    name: '',
                    parentId: data.id,
                    projectId: this.projectId
                }
                this.parentName = "上级节点:" + data.name
            }, 200)


        },
        /**
         * 提交表单
         */
        async submitForm() {

            const formEl: any = this.$refs.ruleFormRef

            await formEl?.validate(async (valid: any, fields: any) => {
                if (valid) {
                    if (this.actionType === 'edit') {
                        await this.goUpdate({ model: this.ruleForm, id: this.ruleForm.id })
                    }
                    else {
                        await this.goAdd(this.ruleForm)
                    }
                    this.resetForm()
                    this.refreshTree(this.currentNode.parentId)
                    this.hasNode = false
                } else {
                    console.log('error submit!', fields)
                }
            })
        },
        /* 
         更新节点 
         */
        async goUpdate(data: any) {
            const result: any = await api.commonWf.metaUpdate(data)
            if (result.returnCode === 0 && result.resultCode === 0) {
                ElMessage({ message: '子节点更新成功', type: 'success' })
            }
        },
        async goAdd(data: any) {
            const result: any = await api.commonWf.metaAdd(data)
            if (result.returnCode === 0 && result.resultCode === 0) {
                ElMessage({ message: '节点添加成功', type: 'success' })
            }
        },
        /* 
        重置表单数据
        */
        resetForm() {
            this.ruleForm = {
                metaDataTable: '',
                name: '',
                parentId: '',
                projectId: ''
            }
            const formEl: any = this.$refs.ruleFormRef

            formEl?.resetFields()
        },
        /* 
        删除节点，并局部刷新目录树
        */
        async deleteNode() {

            await api.commonWf.metaDel({ id: this.currentNode.id })
            this.hasNode = false
            this.refreshTree(this.currentNode.parentId)
        },
        /**
         * 单独刷新节点
         * guid: 当前节点的父级唯一标识节点
         */
        refreshTree(guid: string) {
            console.log(guid, "=====")
            if (guid) {
                let myobj: any = this.$refs.tree
                let node = myobj.getNode(guid);
                if (node) {
                    node.loaded = false;    //告诉组件这个节点需要加载
                    node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
                }
            }
            else {
                //重新载入刷新上级节点
                this.reloadTree = false
                setTimeout(() => {
                    this.reloadTree = true
                }, 200)
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

.stepDialogContainer {

    position: relative;
    height: calc(100vh * 0.5);

    &>span {
        height: calc(100vh * 0.5);
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
