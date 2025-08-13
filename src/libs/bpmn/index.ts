import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg'

// 初始化自定义箭头
export const  initArrow = (id: string) => { 
    const myArrow = document.getElementById(id)
    // console.log(myArrow, "========")
    // 检测是否已经存在
    if (!myArrow) {
        const marker = svgCreate('marker')

        svgAttr(marker, {
            id,
            viewBox: '0 0 20 20',
            refX: '11',
            refY: '10',
            markerWidth: '10',
            markerHeight: '10',
            orient: 'auto'
        })

        const path = svgCreate('path')

        svgAttr(path, {
            d: 'M 1 5 L 11 10 L 1 15 Z',
            style:
                ' stroke-width: 1px; stroke-linecap: round;fill:#ccc; stroke-dasharray: 10000, 1; '
        })




        const defs = document.querySelector('defs') as any
        // console.log(defs, "=====")
        svgAppend(marker, path)
        svgAppend(defs, marker)
    }

}
