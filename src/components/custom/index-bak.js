 
import CustomPalette from './CustomPalette'
import CustomRenderer from './CustomRenderer' // 自定义渲染
import CustomContextPad from './CustomContextPad'// 清除原有自定义扩展面板

export default {
    __init__: ['customRenderer','paletteProvider', 'customContextPad'],
    customRenderer: ['type', CustomRenderer],
    customContextPad: ['type', CustomContextPad],
    paletteProvider: ['type', CustomPalette]
}

