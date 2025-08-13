<template>
  <div>
    <el-button type="primary" @click="addNode">添加节点</el-button>
    <el-button type="primary" @click="getNodesJSON()">获取JSON</el-button>
    <div ref="container" style="height: 600px; border: 1px solid #e9e9e9;"></div>
  
  </div>
</template>

<script>
import { Graph,Shape  } from '@antv/x6'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'X6Graph',
  setup() {
    const container = ref(null)
    let graph = null

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}
    onMounted(() => {
      // 初始化画布
      graph = new Graph({
        container: container.value,
        width: 800,
        height: 500,
        grid: true,
               interacting: {
        nodeMovable: true,
        edgeMovable: true,
        },
      })

      // 添加一个初始节点
    //   const node = graph.addNode({
    //     x: 50,
    //     y: 50,
    //     width: 80,
    //     height: 40,
    //     label: '节点',
    //   })

        graph.fromJSON(data)

        // 监听节点点击
      graph.on('node:click', ({ node }) => {
       console.log(`点击了节点: ${node.id}`);
        //node.attr('body/fill', '#f0f7ff'); // 修改节点颜色
      });
    })

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  html() {
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.innerHTML = "32131231";
    return div
  },
})

    // 添加节点的方法
    const addNode = () => {
      if (graph) {
          graph.addNode({
              x: 60,
              y: 50,
              width: 180,
              height: 80,
              shape: 'custom-html',
  ports: {
    groups: {
      out: {
        position: 'bottom',   // 链接桩位置
        label: {
          position: 'bottom', // 标签位置
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port4',
        group: 'out',
      }
    ],
  },
})

// graph.addNode({
//   shape: 'custom-html',
//   x: 60,
//   y: 100,
// })


}
}




 const getNodesJSON = () => {
     // 获取所有节点
      const nodes = graph.getNodes();
      // 将节点转换为JSON数组
      const nodesJSON = nodes.map(node => node.toJSON());
      
        // 获取所有边
      const edges = graph.getEdges();
      // 将每条边转换为 JSON 格式
      const jsonData = edges.map(edge => edge.toJSON());
      
      console.log(nodesJSON);
      console.log(jsonData);
}

    return {
      container,
      addNode,
      getNodesJSON,
    }
  },
})

</script>

<style lang="less">
.html-basic-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .customhtml {
    width: 100%;
    height: 100%;
    background: #333232;
    border-radius: 1em;
    box-shadow: 0 0.125em 0.3125em rgb(0 0 0 / 25%),
      0 0.02125em 0.06125em rgb(0 0 0 / 25%);
    perspective: 600px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 50%;
      background: #333232
        linear-gradient(180deg, rgb(0 0 0 / 10%) 50%, rgb(0 0 0 / 40%));
      border-radius: 0 0 1em 1em;
      transform: rotateX(180deg);
      transform-origin: center top;
      transition: 0.7s ease-in-out transform;
      content: ' ';
    }

    &:hover::before {
      transform: rotateX(0);
    }
  }
}

</style>