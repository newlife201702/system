 
import CustomPalette from './CustomPalette'
import CustomRenderer from './CustomRenderer' // 自定义渲染
 
import CustomContextPadProvider from './CustomContextPad'
export default {
    __init__: ['customRenderer','paletteProvider','contextPadProvider'],
    customRenderer: ['type', CustomRenderer],
    paletteProvider: ['type', CustomPalette],
    contextPadProvider: ['type', CustomContextPadProvider]
}

