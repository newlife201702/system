// =================================简单自定义渲染===========================================
/**
 * 自定义之后可以渲染自己想要的
 */
import { customElements, customConfig } from './customConfig.js' // 导入公共方法和配置
// 创建Svg
import { append as svgAppend, create as svgCreate } from 'tiny-svg'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer' // 引入默认的renderer
import { splitByString } from '@/libs/utils'
const HIGH_PRIORITY = 1500 // 最高优先级

export default class CustomRenderer extends BaseRenderer {
  // 继承BaseRenderer
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY)
    this.bpmnRenderer = bpmnRenderer
  }

  canRender(element) {
    // 忽略标签
    return !element.labelTarget
  }

  drawShape(parentNode, element) {
    // 核心函数就是绘制shape
    let type = element.type // 获取到类型
    // console.log(element,"---element---")
    // console.log(type,"----///---")
    // console.log(element.businessObject.documentation,"+_+")
    // 载入xml的时候，检测是否有docment属性，获取属性中的自定义节点类型
    if (element.businessObject.documentation) {
      element.businessObject.documentation.map((item) => {
        type = item.$attrs.type
      })
    }

    if (customElements.includes(type)) {
      const { url, attr } = customConfig[type]
      const customIcon = svgCreate('image', {
        // 在这里创建了一个image
        ...attr,
        href: url,
      })

      // 可以看到,实现让页面渲染出自己想要的效果的做法就是使用svgCreate方法创建一个image并添加到父节点中.
      element.width = attr.width // 这里我是取了巧, 直接修改了元素的宽高 设定这个玩意的宽高
      element.height = attr.height
      svgAppend(parentNode, customIcon)
      //   console.log("=======")
      //   console.log(element.businessObject)
      //   console.log(element.businessObject.$type)
      //   对任务类型中输入的数据做数据回显处理
      if (
        element.businessObject.name &&
        element.businessObject.$type === 'bpmn:Task'
      ) {
        // if (element.businessObject.name.length <= 8) {
        //     const text = svgCreate('text', {
        //       x: 40, 
        //       y: 28,
        //       'font-size': '14',
        //       fill: '#2f4056',
        //     })
        //     text.innerHTML = element.businessObject.name
        //     text.title = element.businessObject.name
        //     svgAppend(parentNode, text)
        //   } else {
              const textString=element.businessObject.name
              //console.log(textString)
              const arrList=splitByString(textString, 16)
              const arrLength=arrList.length
              for(let i=0 ;i< arrList.length;i++) {
                  
                  const text = svgCreate('text', {
                      x: 40,
                      y: 16*(i+1)+20 -16*arrLength/2 ,
                      'font-size': '14',
                      fill: '#2f4056',
                  })
                  text.innerHTML = arrList[i]
                  //   parentNode.title = element.businessObject.name
                  svgAppend(parentNode, text)
            //   }
  
 
          }
      }

      return customIcon
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element)

    return shape
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape)
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer']
