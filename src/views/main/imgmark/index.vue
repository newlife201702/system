<template >
    <div class="w-full overflow-auto p-2" style="height: calc(100% - 7rem)" ref="screenshot">
        <div class="btns mb-2">
          <el-button size="small" type="primary" @click="setMode('CIRCLE')">{{ '圆' }}</el-button>
          <el-button size="small" type="primary" @click="setMode('RECT')">{{ '矩形' }}</el-button>
          <el-button size="small" type="primary" @click="setMode('POLYGON')">{{ '多边形' }}</el-button>
          <el-button size="small" type="primary" @click="setMode('PAN')">{{ '平移模式' }}</el-button>
          <el-color-picker v-model="color1"  @change="handleColorChange" />
          <el-button size="small" type="primary" @click="clrlayer()">删除图层</el-button>
          <el-button size="small" type="primary" @click="clrAlllayer()">清空所有图层</el-button>
          <el-button size="small" type="primary" @click="saveimg()">保存图片</el-button>
        </div>
        <div class="common-layout">
        <el-container>
            <el-main>
                 <div v-for="(v, k) in imgs" :key="k" :id="v.id" v-show="v.id == selectedId" class="relative w-full overflow-hidden bg-gray-110" style="height: calc(100% - 2rem)"></div>
                 <canvas ref="canvas"></canvas>
            </el-main>
            <el-aside width="200px">
                      <el-table :data="list" border style="width: 100%;margin-top: 15px;max-width:920px">
                                <el-table-column label="标注意见">
                                    <template #default="scope">
                                          {{ scope.row.id }}                                  
                                         <el-input v-model="scope.row.message"
                                         type="textarea"
                                         placeholder="请输入" />
                                    </template>
                                </el-table-column>
                        </el-table>

            </el-aside>
        </el-container>
      </div>
      </div>
</template>

<script lang="ts" setup>

    import AILabel from 'ailabel'
    //index.js   addMarker处增加了代码


    import { ref,onMounted } from 'vue'
    import { ElMessage } from 'element-plus'
    import type { FormInstance, FormRules } from 'element-plus'
    import { nextTick, reactive, defineEmits } from 'vue'

    import * as api from '@/api'
    import html2canvas from 'html2canvas';

    
    
    let selectedId = ref(1), // 选中的图片ID
    imgs = ref([{}]), // 图片列表
    gMap = ref<any>({}), // 地图实例
    drawingStyle = ref<any>({}), // 绘制样式
    featureLayer = ref<any>({}), // 绘制图层
    textLayer = ref<any>({}), // 文字图层
    imgLayer = ref<any>({}), // 图片图层
    graphCount = ref<any>(0); // 图片计数
    const textStyle = { fillStyle: "#F4A460", strokeStyle: "#D2691E", background: true, globalAlpha: 1, fontColor: "#0f0" }; // 文本样式
    let color1 = ref('#5242BA')
    const list = ref<any>([])
    const screenshot =  ref();

    //在添加图片的时候进行画布初始化
    onMounted(() => {
        addImg()
    })

    graphCount.value = 1;
    // 添加图片
    const addImg = async () => {    
    //推荐以网络图片地址为例测试
    const obj = {
        url: `./images/img.jpeg`,
        count: 0,
        id: graphCount.value
    };
    imgs.value.push(obj);
    console.log("imgs" +  imgs)
    await nextTick();
    const n = imgs.value.length;
    selectedId.value = graphCount.value;

    initGraph(graphCount.value);
    };

//初始化画布
const initGraph = (id: any) => {
  if (selectedId.value != id) return;
  console.log("initGraph")
  gMap[id] = new AILabel.Map(id, {
    center: { x: 400, y: 250 },
    zoom: 500,
    mode: "PAN",
    refreshDelayWhenZooming: true,
    zoomWhenDrawing: true,
    panWhenDrawing: true,
    zoomWheelRatio: 5,
    withHotKeys: true
  });

  // click单击事件
  gMap[id].events.on("click", (point: any) => {
    const feature = gMap[id].getTargetFeatureWithPoint(point.global) || {};
    if (feature.id) {
      gMap[id].setActiveFeature(feature);
      addDeleteIcon(id, feature);
      //showItem.value = true; //可以控制详情显示
      console.log('gmap click')
    }
  });
  // 绘制完成事件
  gMap[id].events.on("drawDone", (type:any, data:any) => {
    addFeature(id, type, data,'');
  });
  // 双击编辑
  gMap[id].events.on("featureSelected", (feature:any) => {
    gMap[id].setActiveFeature(feature);
    // 增加删除按钮
    addDeleteIcon(id, feature);
  });
  // 单机空白取消编辑
  gMap[id].events.on("featureUnselected", () => {
    gMap[id].markerLayer.removeAllMarkers();
    gMap[id].setActiveFeature(null);
  });
  // 更新完
  gMap[id].events.on("featureUpdated", (feature:any, shape:any) => {
    // 更新或者移动需要重新设置删除图标
    gMap[id].markerLayer.removeAllMarkers();
    // 更新text的位置
    const text = textLayer[id].getTextById(feature.id);
    text.updatePosition(getIndexPosition(feature, shape));
    feature.updateShape(shape);
    addDeleteIcon(id, feature);
  });

// 删除
  gMap[id].events.on("FeatureDeleted", () => {});
  // 初始化图层
  featureLayer[id] = new AILabel.Layer.Feature(
    "featureLayer", // 图层id
    { name: "featureLayer" },
    { zIndex: 10 }
  );
  gMap[id].addLayer(featureLayer[id]);
  textLayer[id] = new AILabel.Layer.Text(
    "text",
    { name: "textLayer" }, // props
    { zIndex: 12, opacity: 1 } // style
  );
  gMap[id].addLayer(textLayer[id]);
  const imgurl = imgs.value.find((v) => v.id == id)?.url;
  imgLayer[id] = new AILabel.Layer.Image(
    "img",
    {
      src: imgurl,
      width: 800,
      height: 500,
      position: {
        // 左上角相对中心点偏移量
        x: 0,
        y: 0
      }
      // grid: {
      //   // 3 * 3
      //   columns: [{ color: "#9370DB" }, { color: "#FF6347" }],
      //   rows: [{ color: "#9370DB" }, { color: "#FF6347" }]
      // } // 网格线颜色
    },
    { zIndex: 5 }
  );
  gMap[id].addLayer(imgLayer[id]);
 
};




// 增加删除图标
const addDeleteIcon = (id:any, feature:any) => {
  // 添加delete-icon
  let points = getPoints(feature);
  const gFirstMarker = new AILabel.Marker(
    +new Date(), // id
    {
      //src: "http://192.168.2.179:9100/template/delete.png",
      position: points[1], // 矩形右上角
      offset: {
        x: -16,
        y: -16
      }
    }, // markerInfo
    { name: "delete" } // props
  );
  gFirstMarker.events.on("click", (marker:any) => {
    // 首先删除当前marker
    gMap[id].markerLayer.removeMarkerById(marker.id);
    // 删除对应text
    textLayer[id].removeTextById(feature.id);
    // 删除对应feature
    featureLayer[id].removeFeatureById(feature.id);
  });
  gMap[id].markerLayer.addMarker(gFirstMarker);
};



// 获取所有点
const getPoints = (feature:any) => {
  switch (feature.type) {
    case "RECT":
      return feature.getPoints();
    case "CIRCLE":
      return feature.getEdgePoints();
    case "POLYGON":
      return feature.shape.points;
    default:
      return [];
  }
};

// 设置模式
const setMode = (mode:any) => {
  const layers = gMap[selectedId.value].getLayers()?.filter((v) => v.type == "IMAGE") || [];
  if (mode != "PAN" && !layers.length) {
    // elMessage(Translate.i18n("请先添加方案图片"), "warning");
    return;
  }
  gMap[selectedId.value].setMode(mode);
  if (mode == "CIRCLE") {
    drawingStyle = { fillStyle: color1, strokeStyle: color1, lineWidth: 1 };
    gMap[selectedId.value].setDrawingStyle(drawingStyle);
  } else if (mode == "RECT") {
    drawingStyle = { strokeStyle: color1, lineWidth: 1 };
    gMap[selectedId.value].setDrawingStyle(drawingStyle);
  } else if (mode == "POLYGON") {
    drawingStyle = { strokeStyle: color1, fillStyle: color1, globalAlpha: 0.3, lineWidth: 1, fill: true, stroke: true };
    gMap[selectedId.value].setDrawingStyle(drawingStyle);
  }
};

// 添加图层元素-元素数字标记
const addFeature = (id:any, type:any, data:any, name:any) => {
  let count = imgs.value.find((v) => v.id == id)?.count;
  count++;
  imgs.value.forEach((v) => {
    if (v.id == id) {
      v.count = count;
    }
  });
  console.log('addFeature' + count)


  if (type == "CIRCLE") {
    const circleFeature = new AILabel.Feature.Circle(
      count, // id
      data, // shape
      { name }, // props
      drawingStyle // style
    );

    featureLayer[id].addFeature(circleFeature);
    addText(id, count, { x: data.cx, y: data.cy });
  } else if (type == "RECT") {
    const rectFeature = new AILabel.Feature.Rect(
      count, // id
      data, // shape
      { name }, // props
      drawingStyle // style
    );
    featureLayer[id].addFeature(rectFeature);
    addText(id, count, { x: data.x, y: data.y });
  } else if (type == "POLYGON") {
    const polygonFeature = new AILabel.Feature.Polygon(
      count, // id
      { points: data }, // shape
      { name }, // props
      drawingStyle // style
    );
    featureLayer[id].addFeature(polygonFeature);
    addText(id, count, data[0]);
  }

  //add mark input 
  addMarkMsg(count);

};

// 添加文本
const addText = (layerId:any, textId:any, point:any) => {
  const textPointer = new AILabel.Text(
    textId, // id
    { text: textId, position: point, offset: { x: 0, y: 0 } }, // shape
    { name: "" }, // props
    textStyle // style
  );
  textLayer[layerId].addText(textPointer);
};

// 获取序号位置
const getIndexPosition = (feature:any, shape:any) => {
  switch (feature.type) {
    case "RECT":
      return { x: shape.x, y: shape.y };
    case "CIRCLE":
      return { x: shape.cx, y: shape.cy };
    case "POLYGON":
      return shape.points[0];
    default:
      return {};
  }
};

const changeImg = async (v:any, k:any) => {
  selectedId.value = v.id;
  await nextTick();
  if (!gMap[v.id]) {
    initGraph(v.id);
  }
};

const resizeMap = () => {
  nextTick(() => {
    gMap[selectedId.value] && gMap[selectedId.value].resize();
    gMap[selectedId.value] && gMap[selectedId.value].centerAndZoom({ center: { x: 400, y: 250 }, zoom: 500 });
  });
};

//
const addMarkMsg = (id:any) => {
    console.log(list)
    list.value.push({
        message: '',
        id: id
    })
}

const doMarkMsg = (index: number) => {
    list.value.splice(index-1, 1);
    console.log('doMarkMsg' +  list.value.length);
}

//清空矢量图层
const clrlayer = () =>{
  let currentSel = sessionStorage.getItem('currentSel');
  if(currentSel != ''){
    featureLayer[1].removeFeatureById(Number(currentSel));
    textLayer[1].removeTextById(Number(currentSel));

    doMarkMsg(Number(currentSel))
    sessionStorage.removeItem('currentSel')
  }
}

//清空所有矢量图层
const clrAlllayer = () =>{
  featureLayer[1].removeAllFeatures();
  textLayer[1].removeAllTexts();

  //删除意见框
  list.value.splice(0);
}

const saveimg = () =>{
      //保存图片
      // const image = imgLayer[1].canvas.toDataURL('./images/img.jpegt');
      // const link = document.createElement('a');
      // link.download = 'canvas-image.png'; // 设置下载的文件名
      // link.href = image;
      // link.click(); // 模拟点击以触发下载
      //截图  
      html2canvas(screenshot.value).then(canvas => {
        // 将canvas转换为图片并下载
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = imgData;
        link.click();
      });
}


//设置矢量图层的颜色
const handleColorChange = (color:any) =>{
  console.log('color1' +  color);
  color1 = color;
}


// watch(
//   () => showItem.value,
//   () => {
//     resizeMap();
//   }
// );



</script>




