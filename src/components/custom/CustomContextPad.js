export default class CustomContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate, modeling, bpmnFactory) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.modeling = modeling;
        this.bpmnFactory = bpmnFactory;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this); // // 定义这是一个contextPad
    }

    getContextPadEntries(element) {
        const {
            bpmnFactory,
            autoPlace,
            create,
            elementFactory,
            translate
        } = this;

        function appendTask(event, element) {
            if (autoPlace) {
                // const shape = elementFactory.createShape({ type: 'bpmn:Task' });
                const businessObject = bpmnFactory.create('bpmn:ServiceTask') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了876
              type: 'bpmn:namei',
              businessObject
            })
                autoPlace.append(element, shape);
            } else {
                appendTaskStart(event, element);
            }
        }

        function appendTaskStart(event) {
            // const shape = elementFactory.createShape({ type: 'bpmn:Task' });
            const businessObject = bpmnFactory.create('bpmn:ServiceTask') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了876
              type: 'bpmn:namei',
              businessObject
            })

            create.start(event, shape, element);
        }

        return {
            // 'append.lindaidai-task': {
            //     group: 'model',
            //     className: 'icon-custom   namei',
            //     title: translate('创建一个类型为lindaidai-task的任务节点'),
            //     action: {
            //         click: appendTask,
            //         dragstart: appendTaskStart
            //     }
            // }
        };
    }
}
 


CustomContextPad.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate',
    'modeling',
    'bpmnFactory'
];
