<template>
    <el-card shadow="never">
        <h1 class="lmtitle2" style="margin-bottom: 20px;">
            {{ formData.aosTemplateFlow?.name }}

            <span style="float: right; margin-top: -5px; ">
                <!-- <el-button type="primary" @click="handCheckForm">规范检查</el-button>
                <el-button type="primary" @click="handleToSVG">导出SVG</el-button> -->
                <el-button type="primary" @click="checkFormData">保存</el-button>
                
            </span>
        </h1>
        <div class="bpmnContainers">
            <div class="canvas" ref="canvas"></div>
              <panel ref="myPanel" @setbpmnNodeProp="setbpmnNodeProp" :templateId1="templateId1"
                :lastArchiveId="lastArchiveId"></panel>
        </div>
        <div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import panel from './components/panel.vue'
import bpmnXmlStr from './xml/index.ts'

import * as api from '@/api'
// import { getTimeStamp } from '@/libs/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
// 自定义

import CustomModeler from './customModeler/index.js'

import { toRefs } from 'vue'
import { uuid, getCurrentTimeString } from '@/libs/utils'


const canvasType = ref<string>('bpmn:Process')
// 表单统一提交数据
const formData = ref<any>({
    bpmnXml: "",//bpmn图
    svgXml: "",
    projectId: '',
    flowId:  '',
    flowName:  '',
    statusCode: '',
    statusName: '',
    flowType: '',
    flowTypeName: '',
    businessCode:  '',
    businessTable:  '',
    businessTableName:  '',
    autoNodeSortNo:  'true',
    generBackLine:  'false',
    countersign: 'false',
    workItemParams: [],//流程节点集合
    feFlowRelationResultList: []
})

import { useRoute, useRouter } from 'vue-router';
const projectId = ref();
const importFlow = ref<boolean>(false)
const flowVersionInfo = ref<any>({})
const isWrokTemplate = ref<boolean>()
const templateId1 = ref<string>("")
const bpmnModeler = ref<any>()
const myPanel = ref()
const myPressId = ref<string>('Process_1')
const myFlowGraphId = ref<string>('')
// const bpmnId = ref<string>('cba46547ce9b4827b163cef0b44427f3')
// const bpmnId = ref<string>('')
const dataTimestamp = ref<string>('')
const canvas = ref<any>()
const route = useRoute()
const getFlowId = ref<any>()

let panview = ref<any>(1)

const props = defineProps({ 
    flowId: String, 
    flowGraphId: String, 
    lastArchiveId: String 
})
const { 
    flowId, 
    flowGraphId, 
    lastArchiveId
} = toRefs(props)

const bpmxl = ref<string>('')
const firstLoad = ref<boolean>(false)
const setLableName = (data: any) => {
    const element = getBpmnByid(data.nodeId)
    const modeling = bpmnModeler.value.get('modeling')
    modeling.updateLabel(element, data?.name)
}

//版本，需要修改接口
const getVersinInfo = async () => {
    // const result = await api.functionProcess.getTemolateFlowVersion({ id: templateFlowId?.value })
    // if (result.returnCode === 0 && result.resultCode === 0) {
    //     if (result.data.length > 0) {
    //         flowVersionInfo.value = result.data[0]
    //     }
    // }
}
//更新节点nodeId
const updateNodeId = async (currentNodeId: string) => {
    const element = getBpmnByid(currentNodeId)
    // console.log(element, "============", element.type)
    const nodeType = element?.type
    const elementRegistry = bpmnModeler.value.get('elementRegistry')
    const myArr = currentNodeId.split("_")

    if (myArr.length === 4 || myArr.length === 5) {
        if (myArr.length === 4) {
            myArr.pop()
            myArr.push(getCurrentTimeString())
        }
        if (myArr.length === 5) {
            const nodeExtendType = myArr[4]
            myArr.pop()// 移除扩展
            myArr.pop()// 移除时间戳
            myArr.push(getCurrentTimeString())
            myArr.push(nodeExtendType)
        }

        const newNodeId = myArr.join("_")
        if (currentNodeId !== newNodeId) {
            await updateNodeDataId(currentNodeId, newNodeId)

            element.businessObject.id = newNodeId
            elementRegistry.updateId(element, newNodeId)
            //重新打开属性框赋值
            const currentFormData = getCurrentFormData(nodeType, newNodeId)
            myPanel.value.openDrawer({ nodeType: nodeType, ...currentFormData, nodeId: newNodeId })
        }
        else {
            console.log("更新时间较短，暂不跟新节点id ")
        }

        //结束
    }
    else {
        console.log("参数结构不正确，不更新节点")
    }



}
// 更新相关数据的NodeId
const updateNodeDataId = async (currentNodeId: string, newNodeId: string) => {
    formData.value.workItemParams.map((item: any, index: number) => {
        if (item.nodeId === currentNodeId) {
            formData.value.workItemParams[index] = { ...item, bpmnTaskId: newNodeId, nodeId: newNodeId }
        }
    })
}
// 设置提交的数据
const setbpmnNodeProp = async (data: any) => {
     console.log(JSON.stringify(data), "====formData=====")
    // 将属性面板的值改变到画布中
    if (data.nodeType === 'bpmn:Process') {
        // formData.value.aosTemplateFlow = { ...data, parentId: parentId?.value, flowGraphId: flowGraphId?.value }
        // window.document.title = formData.value.aosTemplateFlow.name || ''
    }
    else {
        await setCurrentFormData(data)
        await setLableName(data)
        await updateNodeId(data.nodeId)

    }

    // 保存并同步画布
    // await handleToBpmn()
}
// 设置表单数据到表单列表中
const setCurrentFormData = async (data: any) => {
    let hasData = false
     console.log(data, "data")
     console.log(formData.value.workItemParams, "formData")

    formData.value.workItemParams.map((item: any, index: number) => {
        {{  item.nodeId  +  "|||" + data.nodeId  }}
        if (item.nodeId === data.nodeId) {
            // console.log(item, "ddd")
            // item = data
            formData.value.workItemParams[index] = { bpmnTaskId: data.nodeId, ...data }
            hasData = true
        }
    })
    if (!hasData) {
        formData.value.workItemParams.push({ bpmnTaskId: data.nodeId, ...data })
    }

    // console.log(formData.value.workItemParams, "wode ")


}

const createNewDiagram = async () => {
    // // 设置画布动态ID
    // // let bpmxl = bpmnXmlStr.replace(new RegExp('Process_1', 'g'), myPressId.value);
     bpmxl.value = bpmnXmlStr
     if (myFlowGraphId.value) {
    //     // console.log('Xml')
         await getGraphInfo()
     }
    //  await getGraphInfo()
    try {
        //bpmxl.value=bpmnXmlStr
        //console.log(bpmxl.value)
        //console.log("加载画布")
        await bpmnModeler.value?.importXML(bpmxl.value)
    } catch (err: any) {
        console.log('视图加载失败')
        // console.log(err.message, err.warnings);
    }
   
}
const getFileName = (xml: any) => {
    let split = xml.split('process id="')
    return split[1].split('" ')[0] + '.bpmn20.xml'
}
const handleToXml = async () => {
    bpmnModeler.value.saveXML(function (err: any, xml: any) {
        if (err) {
            console.log(err)
        } else {

            if (xml) {
                const name = getFileName(xml)
                // 把输就转换为URI，下载要用到的
                const encodedData = encodeURIComponent(xml)
                const downloadLink = document.createElement('a')

                // 将数据给到链接
                downloadLink.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
                // 设置文件名
                downloadLink.download = name
                // 触发点击事件开始下载
                downloadLink.click()
                URL.revokeObjectURL(downloadLink.href); // 释放URL 对象
            }
        }
    })
}

const handleToBpmn = async () => {
    bpmnModeler.value.saveXML(async (err: any, xml: any) => {
        if (err) {
            console.log(err)
        } else {
            if (xml) {
                let formData: any = {
                    content: JSON.stringify(xml)
                }
                if (myFlowGraphId.value) {
                    formData.id = myFlowGraphId.value
                    formData.dataTimestamp = dataTimestamp.value
                }
                let result = await api.bpmn.saveOrUpdate(formData)
                myFlowGraphId.value = result.data
                // 当第一次页面进入 获取xml图片id 同时与基本信息建立关联
                if (!firstLoad.value) {
                    console.log('更新面板')
                    openSetting(getBpmnByid(myPressId.value))
                    firstLoad.value = true
                }

                await getGraphInfo()
                // console.log(result)

                // api.templateFlow.saveBpmn({ "id": props.flowId, "model": { flowGraphId: result.data } })
            }
        }
    })
}
const handleToSVG = async (): Promise<void> => {
    try {
        const result = await bpmnModeler.value.saveSVG()
        const { svg } = result

        const mySyle = `<style type="text/css">
        .djs-connection path {
            stroke: #ccc !important;
        }
        .djs-container path {
            stroke: #ccc !important;
        }
       defs path {
            fill: #ccc !important; 
            stroke: #ccc !important;
  }</style></svg>`


        //   const newsvg = svg.replace(/href="data/g, 'xlink:href="data')

        var svgBlob = new Blob([resetSvgData(svg.replace('</svg>', mySyle).replace(/href="data/g, 'xlink:href="data'))], {
            type: 'image/svg+xml'
        })

        var downloadLink = document.createElement('a')
        downloadLink.download = formData.value.aosTemplateFlow.name + '.svg'
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(svgBlob)
        downloadLink.onclick = function (event) {
            document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
    } catch (err) {
        console.log(err)
    }
}
const resetSvgData = (svg: string) => {
    let bgMap: any = {}, defs: any = [];

    // 替换image标签：
    let mysvg = svg.replace(/<image x="0" y="0" ([^>]*? xlink:href=")([^"]*?)"\/>/gi, function () {
        if (!bgMap[arguments[2]]) {
            bgMap[arguments[2]] = 'bg' + defs.push('<image id="bg' + (defs.length + 1) + '" ' + arguments[1] + arguments[2] + '"/>');
        }
        return '<use xlink:href="#' + bgMap[arguments[2]] + '"/>';
    });
    mysvg = mysvg.replace(/<\/svg>$/ig, '<defs>' + defs.join('') + '</defs></svg>');
    return mysvg
}
const getSvgData = async () => {
    try {
        const result = await bpmnModeler.value.saveSVG()
        const { svg } = result

        const mySyle = `<style type="text/css">
        .djs-connection path {
            stroke: #ccc !important;
        }
        .djs-container path {
            stroke: #ccc !important;
        }
       defs path {
            fill: #ccc !important; 
            stroke: #ccc !important;
  }</style></svg>`



        var svgData = resetSvgData(svg.replace('</svg>', mySyle).replace(/href="data/g, 'xlink:href="data'))

        return svgData
    } catch (err) {
        console.log(err)
        return
    }
}
// 根据节点获取相关信息
const getBpmnByid = (nodeId) => {
    const elementRegistry = bpmnModeler.value.get('elementRegistry')
    var shape = elementRegistry.get(nodeId)
    return shape
}
const addEventListen = (): void => {
    const eventBus = bpmnModeler.value.get('eventBus')
    // const modeling = bpmnModeler.value.get('modeling');
    // 这里我是用了一个forEach给modeler上添加要绑定的事件
    const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
    events.forEach(function (event) {
        eventBus.on(event, (e) => {
            // console.log(event, "event")
            // console.log(e, "---")
            var elementRegistry = bpmnModeler.value.get('elementRegistry')
            var shape = e.element ? elementRegistry.get(e.element.id) : e.shape

            // 创建节点的时候 给节点挂载data 节点属性为自定的属性名称
            if (event === 'shape.added') {
                // 在页面加载的时候 如果带有document属性，则取消设置 document属性 新建节点则添加docment 属性
                if (!shape.businessObject.documentation) {
                    //更新id start
                    let nodeExtendType = ""
                    if (shape.type === 'bpmn:event1') {
                        nodeExtendType = "_Start"
                    }
                    if (shape.type === 'bpmn:event2') {
                        nodeExtendType = "_End"
                    }
                    const newNodeId = e.element.id + "_" + uuid(32, 62) + "_" + getCurrentTimeString() + nodeExtendType


                    // console.log(newNodeId)
                    shape.businessObject.id = newNodeId
                    elementRegistry.updateId(shape, newNodeId)
                    //更新id end
                    setBpmnData(shape, { type: shape.type })
                    // 打开弹框
                    // console.log(shape.type, "nodeType")
                    // 设置默认值
                    if (shape.type === 'bpmn:event1' || shape.type === 'bpmn:event2') {
                        if (shape.type === 'bpmn:event1') {
                            myPanel.value.openDrawer({ name: "开始", nodeType: shape.type, id: "", nodeId: newNodeId, isWrokTemplate: isWrokTemplate.value })
                        }
                        if (shape.type === 'bpmn:event2') {
                            myPanel.value.openDrawer({ name: "结束", nodeType: shape.type, id: "", nodeId: newNodeId, isWrokTemplate: isWrokTemplate.value })
                        }

                    }

                    else {
                        if (shape.type === 'bpmn:event11' || shape.type === 'bpmn:event12' || shape.type === 'bpmn:event13') {
                            console.log("逻辑节点不弹属性框")
                            return false
                        }

                        myPanel.value.openDrawer({ nodeType: shape.type, id: "", nodeId: newNodeId, isWrokTemplate: isWrokTemplate.value })
                    }

                } else {
                    console.log('载入xml的文件节点')
                }
                // modeling.updateProperties(shape, { name: { editable: false } })
            }
            if (event === 'shape.removed') {
                myPanel.value.openDrawer({
                    nodeType: canvasType.value,
                    ...getCurrentFormData(canvasType.value, '')
                })
            }
        })
    })
}

//设置节点属性documentation
const setBpmnData = (element: any, data: any) => {
    const modeling = bpmnModeler.value.get('modeling')
    const bpmnFactory = bpmnModeler.value.get('bpmnFactory')

    const DOC = bpmnFactory.create('bpmn:Documentation', data)
    // 更新到节点
    setTimeout(() => {
        modeling.updateProperties(element, {
            documentation: [DOC]
        })
    }, 100)
}
// 通过类型与节点id获取表单数据
const getCurrentFormData = (nodeType: string, nodeId: string) => {
    console.log("getCurrentFormData")
    console.log("nodeType=" + nodeType)
    let currentFormData = {}
    if (nodeType === 'bpmn:Process') {
        formData.value.id = getFlowId.value;
        currentFormData = formData.value
    }
    else {
        console.log("workItemParams" +  formData.value.workItemParams)
        formData.value.workItemParams.map((item: any) => {
            if (item.nodeId === nodeId) {
                currentFormData = item
            }
        })
    }
    return currentFormData
}
const addClickListen = () => {

    bpmnModeler.value.on('element.dblclick', async (e) => {
        // setLableName({ ...e.element, name: "dfdfd" })
        // console.log(e)
        // 点击连线 中断分支执行
        if (e.element.type === "bpmn:SequenceFlow") {
            return false
        }
        // console.log(e.element.businessObject.documentation)
        let nodeType = e.element.type

        if (nodeType === 'bpmn:Task' || nodeType === 'bpmn:ExclusiveGateway') {
            e.element.businessObject.documentation.map((item: any) => {
                nodeType = item.$attrs.type
            })
        }

        if (nodeType === 'bpmn:event11' || nodeType === 'bpmn:event12' || nodeType === 'bpmn:event13') {
            console.log("逻辑节点不弹属性框")
            return false
        }

        if (nodeType === 'bpmn:Process') {
            // console.log(getCurrentFormData(canvasType.value, ''))
            myPanel.value.openDrawer({
                nodeType: canvasType.value,
                ...getCurrentFormData(canvasType.value, '')
            })
            // myPanel.value.openDrawer({ nodeType: nodeType, id: "", nodeId: e.element.id, ...formData.value.aosTemplateFlow })
        } else {
            const currentFormData = getCurrentFormData(nodeType, e.element.id)
            // 手动设置选中 start
            var shape = e.element
            bpmnModeler.value.get('selection').select([shape])
            // 手动设置选中 end
            if (JSON.stringify(currentFormData) === '{}') {
                const nodeFormData = await getNodeInfo(e.element.id)
                // console.log(nodeFormData, "myNodeFormData")
                myPanel.value.openDrawer({ nodeType: nodeType, id: "", ...nodeFormData, nodeId: e.element.id, isWrokTemplate: isWrokTemplate.value })
            }
            else {
                myPanel.value.openDrawer({ nodeType: nodeType, id: "", ...currentFormData, nodeId: e.element.id, isWrokTemplate: isWrokTemplate.value })
            }

        }
        return false
    })
}
// 获取bpmnXml文件
const getBpmnXml = async () => {
    try {
        const { xml } = await bpmnModeler.value?.saveXML()
        // console.log(xml)
        if (xml) {
            return JSON.stringify(xml)
        }
        // console.log(bpmnModeler.value.get("ElementFactory"))
    } catch (err: any) {
        console.log('导出失败', err)
        return ""
    }

}
// 获取所有节点
const getBpmnAllNodes = () => {
    const elementRegistry = bpmnModeler.value.get('elementRegistry')
    const allNodes = elementRegistry.getAll()
    return allNodes
}
// 获取画布中需要挂载的任务节点列表
const getTaskNodes = () => {
    const allNodes = getBpmnAllNodes()
    const nodeList: any = []
    allNodes.map(item => {
        const nodeType = item.type
        //网管节点不能挂载数据，需要排除
        const gatewayTypeList = ['bpmn:event11', 'bpmn:event12', 'bpmn:event13']
        let isDataNode = true //是否是可以挂载的数据节点
        // 面板、泳道、泳池、连线不需要挂载数据
        if (nodeType !== 'bpmn:Process' && nodeType !== 'bpmn:Participant' && nodeType !== 'bpmn:Lane' && nodeType !== 'bpmn:SequenceFlow') {
            item.businessObject.documentation.map((subItem: any) => {
                gatewayTypeList.map((gatewayType: string) => {
                    if (gatewayType === subItem.$attrs.type) {
                        isDataNode = false
                    }
                })
            })
            if (isDataNode) {
                nodeList.push(item)
            }
        }
    })
    return nodeList
}
// 检测节点挂载的数据是否挂载相关数据
const checkFormData = async () => {
    const taskNodes = getTaskNodes()
    let nodeType: string = ""
    const workItemParams: any = [] //需要提交的节点以及数据
    //----------- 基本信息输入检测 start---------
    if (JSON.stringify(formData.value.aosTemplateFlow) === '{}' || formData.value.aosTemplateFlow?.name === "") {
        ElMessage.warning('基本信息名称必填！')
        // 打开基本信息面板
        myPanel.value.openDrawer({
            nodeType: canvasType.value,
            ...getCurrentFormData(canvasType.value, '')

        })
        return false
    }
    //----------- 基本信息输入检测 end----------
    //----------- 节点属性输入检测 start---------
    taskNodes.map((item: any) => {
        console.log("checkFormData" + item)
        const dataNode: any = getCurrentFormData(nodeType, item.id)
        if (JSON.stringify(dataNode) === '{}') {
            workItemParams.push({ nodeId: item.id, bpmnTaskId: item.id, flowId: flowId?.value })
        }
        else {
            //将有数据的节点反馈给后端
            workItemParams.push({ ...dataNode, flowId: flowId?.value })
        }

    })

    // 由于业务变更，不需要检测节点是否挂载数据
    // if (!allNodehasData) {
    //     ElMessage.warning('节点属性名称必须输入！')
    //     // 打开基本信息面板
    //     myPanel.value.openDrawer({
    //         nodeType: nodeType,
    //         nodeId: nodeId,
    //         ...nodataNode

    //     })
    //     return false
    // }
    //---------- 节点属性输入检测 end---------
    // 装配提交的表单数据 
    const myFormData: any = {
        svgXml: await getSvgData() || '',
        bpmnXmlJson: await getBpmnXml(),//bpmn图
        projectId: formData.value.projectId,
        flowId:  formData.value.flowId,
        flowName:  formData.value.flowName,
        businessCode:  formData.value.businessCode,
        businessTable:  formData.value.businessTable,
        businessTableName:  formData.value.businessTableName,
        autoNodeSortNo:  'true',
        generBackLine:  'false',
        countersign: 'false',
        feFlowRelationResultList: [],   
        workItemParams: workItemParams,//流程节点集合
        importFlow: importFlow.value
    }

    api.planManage.add(myFormData).then((result) =>{
          if (result.returnCode === 0 && result.resultCode === 0) {

            ElMessage({ message: '保存成功', type: 'success' })
            opener.functionRefreshList('edit')
            // window.close();
        } else {
            ElMessage({
                message: result.returnMessage as string,
                type: 'success'
            })
        }
    })
}


// 根据节点 打开属性设置
const openSetting = async (element: any) => {
    // console.log(element)
    // console.log(myFlowGraphId.value, 'myFlowGraphId')
    myPanel.value.openDrawer({ nodeType: element.type, id: element.id, nodeId: element.id, ...element.businessObject, flowGraphId: myFlowGraphId.value })
}
const getProcessInfo = async () => {
    //查询流程信息
    if (route?.query?.flowId) {
        getFlowId.value =  route?.query?.flowId;
        projectId.value =  route?.query?.projectId;

        if(getFlowId.value != null){
            const flowData = api.flow.getById({id: getFlowId.value});
            let item : any =  (await flowData).data;
            formData.value.projectId = projectId.value; 
            formData.value.flowId =  item.id;
            formData.value.flowName = item.name;
            formData.value.name =  item.name;
            formData.value.code = item.code;
            formData.value.statusCode = item.statusCode;
            formData.value.statusName = item.statusName;
            formData.value.businessCode = item.businessCode;
            formData.value.businessTable = item.businessTable;
            formData.value.businessTableName = item.businessTableName;
            formData.value.flowType = item.flowType;
            formData.value.flowTypeName = item.flowTypeName;
        }
    }
}


//获取活动节点信息
const getNodeInfo = async (nodeId: any) => {
    let nodeRuleForm: any = {}
    api.planManage.getTaskById({ id:  nodeId}).then((result)=>{
          if(result.resultCode === 0 && result.returnCode === 0){
            if(result.data){
                nodeRuleForm  =  result.data;
            }
          }
    })
    return nodeRuleForm
}
onMounted(async() => {
    // myPressId.value = getTimeStamp()
    bpmnModeler.value = new CustomModeler({
        container: canvas.value,
        // bpmnRenderer: {
        //     defaultFillcolor: "#999",
        //     defaultstrokecolor: '#2a2a2a'

        // },
        additionalModules: [
            {
                __init__: ['labelEditingProvider'],
                labelEditingProvider: ['value', null] // 禁用文本编辑
            }
        ]
    })
   
            //await getProcessInfo()
            await createNewDiagram()
    // setTimeout(() => {

    //     const modeling = bpmnModeler.value.get('modeling')

    //     const allNodes = getBpmnAllNodes()
    //     const edgeList = []
    //     console.log(allNodes)
    //     allNodes.map(item => {
    //         if (item.type === 'bpmn:SequenceFlow') {
    //             edgeList.push({ source: item.source, target: item.target })
    //             modeling.removeConnection(item)
    //         }
    //     })

    //     edgeList.map(item => {
    //         modeling.connect(item.source, item.target)
    //     })
    // }, 5000);
})
const getGraphInfo = async () => {
    const result = await api.bpmn.findByPid(myFlowGraphId.value)
     // console.log(result)
     if (result.returnCode === 0) {
         bpmxl.value = importFlow.value ? result?.data?.content : JSON.parse(result?.data?.content as string)
         //当创建的数据为空
         if (!result?.data?.content) {
             bpmxl.value = bpmnXmlStr
         }
         dataTimestamp.value = result?.data?.dataTimestamp as string
     }
    //bpmxl.value = bpmnXmlStr
}
const formatCanvasEdge = () => {
    const modeling = bpmnModeler.value.get('modeling')
    const allNodes = getBpmnAllNodes()
    const edgeList = []
    allNodes.map(item => {
        if (item.type === 'bpmn:SequenceFlow') {
            edgeList.push({ source: item.source, target: item.target })
            modeling.removeConnection(item)
        }
    })

    edgeList.map(item => {
        modeling.connect(item.source, item.target)
    })
}

// 参数初始化
const init = () => {
    if (flowGraphId?.value) {
        myFlowGraphId.value = flowGraphId?.value
    }
}

watch(
    () => props.parentId,
    async (newVal, oldVal) => {
        // if (newVal) {
            //初始化参数
            init()
            //查询流程数据
            await getProcessInfo()
            //画图渲染
            await createNewDiagram()
            //流程节点处理
            addEventListen()
            //点击事件处理
            addClickListen()
            //获取版本信息
            getVersinInfo()

            // 根据id获取画布属性，并打开相关的属性面板
            setTimeout(async () => {
                console.log('settimeout')
                //if (!flowId?.value) {
                if(panview == 0){
                    console.log('处理')
                    await handleToBpmn()
                } else {
                  console.log('直接打开属性面板')
                  console.log(canvasType.value)
                  myPanel.value.openDrawer({
                        nodeType: canvasType.value,
                        ...getCurrentFormData(canvasType.value, '')
                    })
                    firstLoad.value = true
                    if (importFlow.value) {
                        formatCanvasEdge()
                    }
                }
            }, 1500)



        // }
    },
    { immediate: true, deep: true }
)


const handCheckForm = () => {
    myPanel.value.goCheckForm()
}
</script>

<style lang="less">
.bpmnContainers {
    background-color: #ffffff;
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 10px;
    min-height: calc(100vh - 120px);
     .canvas {
        width: calc(100% );
        min-height: calc(100vh - 120px);
        height: 700px;
        border: 1px solid #eee;
        position:absolute;
        left: 0;
    }

    // .panel {
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //     width: 400px;
    //     height: 100vh - 120px;
    // }
}
</style>
