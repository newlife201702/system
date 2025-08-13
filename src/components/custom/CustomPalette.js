export default function PaletteProvider(bpmnFactory, create, elementFactory, palette, translate,handTool,globalConnect,spaceTool,lassoTool) {
    this.bpmnFactory = bpmnFactory
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    this.handTool=handTool,
    this.globalConnect=globalConnect
    this.spaceTool=spaceTool
    this.lassoTool=lassoTool
    palette.registerProvider(this)

 

}

 

PaletteProvider.$inject = [
    'bpmnFactory',
    'create',
    'elementFactory',
    'palette',
    'translate',
    'handTool',
    'globalConnect',
    'spaceTool',
    'lassoTool'
  ]

  
PaletteProvider.prototype.getPaletteEntries = function(element) { // 此方法和上面案例的一样
    const {
        bpmnFactory,
        create,
        elementFactory,
        translate,
        handTool,
        globalConnect,
        spaceTool,
        lassoTool
      } = this

      function createParticipant(event) {
        create.start(event, elementFactory.createParticipantShape());
      }


    function createStartEvent () {
        return {
 
          event1: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event1',
              businessObject
            })
            // console.log(shape) // 只在拖动或者点击时触发
            // 设置创建在居中位置
            shape.width=170
            shape.height=40
            create.start(event, shape)
          },
          event2: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event2',
              businessObject
            })
            // 设置创建在居中位置
            shape.width=170
            shape.height=40
            create.start(event, shape)
          },
          event3: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event3',
              businessObject
            })
 
            create.start(event, shape)
          },
          event4: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event4',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },
          event5: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event5',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },
          event6: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event6',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },    
          event8: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event8',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },
          event9: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event9',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },
          event10: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event10',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },
          event11: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event11',
              businessObject
            })
            shape.width=30
            shape.height=30
            create.start(event, shape)
          },
          event12: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event12',
              businessObject
            })
            shape.width=30
            shape.height=30
            create.start(event, shape)
          },
          event13: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event13',
              businessObject
            })
            shape.width=30
            shape.height=30
            create.start(event, shape)
          },
          event14: (event) => {
            // 还可以用来创建bpmn:StartEvent、bpmn:ServiceTask、bpmn:ExclusiveGateway等等...
            const businessObject = bpmnFactory.create('bpmn:Task') // 貌似是继承哪一个类型的能力
            const shape = elementFactory.createShape({
              // 创建这个元素的类型 我先虽随便写了
              type: 'bpmn:event14',
              businessObject
            })
             // 设置创建在居中位置
             shape.width=170
             shape.height=40
            create.start(event, shape)
          },
        }
      }
  
      return {
 

          'hand-tool': {
            group: 'tools',
            className: 'icon-custom tool1',
            title: translate('手型工具'),
            action: {
              click: function(event) {
                handTool.activateHand(event);
              }
            }
          },
          'lasso-tool': {
            group: 'tools',
            className: 'icon-custom tool2',
            title: translate('控选'),
            action: {
              click: function(event) {
                lassoTool.activateSelection(event);
              }
            }
          },
          'space-tool': {
            group: 'tools',
            className: 'icon-custom tool3',
            title: translate('间距调节'),
            action: {
              click: function(event) {
                spaceTool.activateSelection(event);
              }
            }
          },
          'global-connect-tool': {
            group: 'tools',
            className: 'icon-custom tool4',
            title: translate('连接'),
            action: {
              click: function(event) {
                globalConnect.toggle(event);
              }
            }
          },
          'tool-separator': {//工具分割线
            group: 'model2',
            separator: true
          },

        'create.start': {
          group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
          className: 'icon-custom event1', // 可以用这些类名自定义
          title: translate('开始'), // 鼠标放上去的提示信息
          action: {
            // 监听事件
            dragstart: createStartEvent().event1, // 拖动
            click: createStartEvent().event1 // 点击
          }
        },
        'create.end': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event2', // 可以用这些类名自定义
            title: translate('结束'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event2, // 拖动
              click: createStartEvent().event2 // 点击
            }
          },  
          'create.router1': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event11', // 可以用这些类名自定义
            title: translate('并行'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event11, // 拖动
              click: createStartEvent().event11 // 点击
            }
          },    
          'create.router2': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event12', // 可以用这些类名自定义
            title: translate('包含'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event12, // 拖动
              click: createStartEvent().event12 // 点击
            }
          },  
          'create.router3': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event13', // 可以用这些类名自定义
            title: translate('排他'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event13, // 拖动
              click: createStartEvent().event13 // 点击
            }
          },  
          'create.event4': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event4', // 可以用这些类名自定义
            title: translate('事件'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event4, // 拖动
              click: createStartEvent().event4 // 点击
            }
          },    
          'create.event5': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event5', // 可以用这些类名自定义
            title: translate('活动'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event5, // 拖动
              click: createStartEvent().event5 // 点击
            }
          },      
        //   'create.event6': {
        //     group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
        //     className: 'icon-custom event6', // 可以用这些类名自定义
        //     title: translate('文件'), // 鼠标放上去的提示信息
        //     action: {
        //       // 监听事件
        //       dragstart: createStartEvent().event6, // 拖动
        //       click: createStartEvent().event6 // 点击
        //     }
        //   },      
        //   'participant': {
        //     group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
        //     className: 'icon-custom event7', // 可以用这些类名自定义
        //     title: translate('创建泳道'), // 鼠标放上去的提示信息
        //     action: {
        //       // 监听事件
        //       dragstart: createParticipant,
        //       click: createParticipant
        //     }
        //   },      
        'create.event14': {
            group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
            className: 'icon-custom event14', // 可以用这些类名自定义
            title: translate('子流程'), // 鼠标放上去的提示信息
            action: {
              // 监听事件
              dragstart: createStartEvent().event14, // 拖动
              click: createStartEvent().event14 // 点击
            }
          },
        //   'create.event9': {
        //     group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
        //     className: 'icon-custom event9', // 可以用这些类名自定义
        //     title: translate('系统接口'), // 鼠标放上去的提示信息
        //     action: {
        //       // 监听事件
        //       dragstart: createStartEvent().event9, // 拖动
        //       click: createStartEvent().event9 // 点击
        //     }
        //   },   
          

        //   'create.event10': {
        //     group: 'model', // group: 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
        //     className: 'icon-custom event10', // 可以用这些类名自定义
        //     title: translate('流程接口'), // 鼠标放上去的提示信息
        //     action: {
        //       // 监听事件
        //       dragstart: createStartEvent().event10, // 拖动
        //       click: createStartEvent().event10 // 点击
        //     }
        //   },              
      }
}
 

 
