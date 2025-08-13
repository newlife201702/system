 export default function ContextPadProvider(contextPad, config, injector, translate, bpmnFactory, elementFactory, create, modeling, connect,globalConnect) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    this.bpmnFactory = bpmnFactory
    this.modeling = modeling
    this.connect = connect
    this.globalConnect=globalConnect
    config = config || {}
    if (config.autoPlace !== false) {
        this.autoPlace = injector.get('autoPlace', false);
    }
    contextPad.registerProvider(this)
}

ContextPadProvider.$inject = [
    'contextPad',
    'config',
    'injector',
    'translate',
    'bpmnFactory',
    'elementFactory',
    'create',
    'modeling',
    'connect',
    'globalConnect',
    
]

ContextPadProvider.prototype.getContextPadEntries = function(element) {
    const {
        autoPlace,
        create,
        elementFactory,
        translate,
        modeling,
        connect,
        globalConnect
    } = this;
    // 删除功能
    function removeElement(e) {
        modeling.removeElements([element])
    }

    function clickElement(e) {
        console.log(element)
            // window.localStorage.setItem('nodeInfo', JSON.stringify(element))
            // window.localStorage.setItem('nodeVisible', 'true')
       
    }

    function appendTask(event, element) {
        console.log(autoPlace)
        if (autoPlace) {
            const shape = elementFactory.createShape({ type: 'bpmn:Task' });
            autoPlace.append(element, shape);
        } else {
            appendTaskStart(event, element);
        }
    }

    function appendTaskStart(event) {
        console.log(event)
        const shape = elementFactory.createShape({ type: 'bpmn:Task' });
        create.start(event, shape, element);
    }

    function editElement() { // 创建编辑图标
        return {
            group: 'edit',
            className: 'icon-custom icon-custom-edit',
            title: translate('编辑'),
            action: {
                click: clickElement
            }
        }
    }

    function deleteElement() {
        
        return {
            group: 'tools',
            className: 'entry bpmn-icon-trash',
            title: translate('删除'),
            action: {
                click: removeElement
            }
        }
    }

    return {
        // 'append.lindaidai-task': {
        //     group: 'model',
        //     className: 'icon-custom lindaidai-task',
        //     title: translate('创建一个类型为lindaidai-task的任务节点'),
        //     action: {
        //         click: appendTask,
        //         dragstart: appendTaskStart
        //     }
        // },
        // 'edit': editElement(),
        'delete': deleteElement(),
        'global-connect-tool': {//全局连接工具
            group: 'tools',
            className: 'bpmn-icon-connection-multi',
            title: translate('连线'),
            action: {
                click: function(event) {
                    connect.start(event, element);
                },
                dragstart: function(event) {
                    connect.start(event, element);
                }
            }
        },
        
    }
}
