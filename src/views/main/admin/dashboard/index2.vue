<template>
<el-row :gutter="12" class="cardListContainer">
    <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
        <el-card  > 
          <div class="cardBoxContainer">
            <h1><span>过去七天</span>浏览量</h1>
            <span>
              6,751 次 <span>增长率：8%</span>
            </span>
            <el-progress :percentage="80" color="#67c23a" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
        <el-card  > 
          <div class="cardBoxContainer">
            <h1><span>最近一个月</span>点击率</h1>
            <span>
              26,751 次 <span>增长率：75%</span>
            </span>
            <el-progress :percentage="75" color="red" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
        <el-card  > 
          <div class="cardBoxContainer">
            <h1><span>过去七天</span>浏览量</h1>
            <span>
              6,751 次 <span>增长率：8%</span>
            </span>
            <el-progress :percentage="8" color="#67c23a" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
        <el-card  > 
          <div class="cardBoxContainer">
            <h1><span>过去七天</span>热门投票</h1>
            <span>
              36,751 次 <span>增长率：61%</span>
            </span>
            <el-progress :percentage="61" color="blue" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
        <el-card  > 
          <div class="cardBoxContainer">
            <h1><span>过去七天</span>浏览量</h1>
            <span>
              6,751 次 <span>增长率：8%</span>
            </span>
            <el-progress :percentage="80" color="#67c23a" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
        <el-card  > 
          <div class="cardBoxContainer">
            <h1><span>过去七天</span>浏览量</h1>
            <span>
              6,751 次 <span>增长率：8%</span>
            </span>
            <el-progress :percentage="80" color="#67c23a" />
          </div>
        </el-card>
      </el-col>



    </el-row>

    <el-row :gutter="12"  >
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <el-card  > 
        <chart-view :chartData="chartData1"></chart-view>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <el-card  >
        <chart-view :chartData="chartData2"></chart-view>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <el-card  > 
        <chart-view :chartData="chartData4"></chart-view>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="12" >
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" style="margin-top: 10px;">
      <el-card  > 
        <chart-view :chartData="chartData3" :chartHeight="400"></chart-view>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" style="margin-top: 10px;">
      <el-card  > 
        <chart-view :chartData="chartData5" :chartHeight="400"></chart-view>
      </el-card>
    </el-col>
  </el-row>

</template>

<script setup lang="ts">
import chartView from './components/chartView.vue'
import * as echarts from 'echarts'
import {ref} from 'vue'
var mycharta={
    title: {
      text: '专利类型',
      left: 'left',
      textStyle:{
        fontSize:15
    },
    },
    tooltip: {},
  //   legend: {
  //     data: ['销量']
  //   },
    xAxis: {
      data: ['发明专利', '外观设计专利', '实用功能专利']
    },
    grid: {
      left: '8%',
      right: '3%',
      bottom: '8%',
      top: '15%',
      containLabel: true
  },
    yAxis: {
       type: 'value',
      name: '数\n量\n(条)',
      nameLocation:'end',
      // align:'center',
      nameGap:-30,// 坐标轴名称与轴线之间的距离。
      // boundaryGap:['0%', '0%'],
      // nameRotate: 360, // 坐标轴名字旋转，角度值。
      nameTextStyle:{
          color:'#000',
          padding:[0,80,0,0],		//表示[上,右,下,左]的边距
      },
      splitLine :{    //网格线
          lineStyle:{
              type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
          },
          show:true //隐藏或显示
      }
  
    },
  
    series: [
      {
        name: '销量',
        barWidth: '50%', 
        type: 'bar',
        data: [5, 33, 42],
        itemStyle: {
            // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
            normal: {
              // 柱形图圆角，初始化效果
              barBorderRadius: [2, 2, 0, 0]
            }
          },
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#5DCFE7'
          },
          {
            offset: 1,
            color: '#29B3D1'
          }
        ])
      }
    ]
  }
var myChartb = {
    title: {
      text: '获奖状态',
      left: 'left',
      textStyle:{
          fontSize:15
      },
    },
    tooltip: {},
  //   legend: {
  //     data: ['销量']
  //   },
    xAxis: {
      data: ['待发起\n审核', '处理申\n请文件', '受理', '审查', '办登', '证书','成功']
    },
    grid: {
      left: '8%',
      right: '3%',
      bottom: '8%',
      top: '15%',
      containLabel: true
  },
    yAxis: {
       type: 'value',
      name: '数\n量\n(条)',
      nameLocation:'end',
      // align:'center',
      nameGap:-30,// 坐标轴名称与轴线之间的距离。
      // boundaryGap:['0%', '0%'],
      // nameRotate: 360, // 坐标轴名字旋转，角度值。
      nameTextStyle:{
      color:'#000',
      padding:[0,80,0,0],		//表示[上,右,下,左]的边距
    },
      splitLine :{    //网格线
          lineStyle:{
              type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
          },
          show:true //隐藏或显示
      }
  
    },
  
    series: [
      {
        name: '销量',
        type: 'bar',

        data: [5, 20, 36, 10, 10, 20,44],
        itemStyle: {
          // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
          normal: {
            // 柱形图圆角，初始化效果
            barBorderRadius: [2, 2, 0, 0]
          }
        },
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#5EB3F2'
          },
          {
            offset: 1,
            color: '#237FC4'
          }
        ])
      }
    ]
  }

var myChartc = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
        type: 'shadow',
        label: {
            show: true,
            backgroundColor: '#333',
            formatter: function (params) {
              // console.log("--x轴类目对应的参数数组--", params); // 比如当鼠标hover到孙悟空同学这一列的时候，这个params数组存放的每一项数据分别是语数外三门成绩的具体信息
              var res =params.value+"完成度："+(params.seriesData[1].value/(params.seriesData[0].value+params.seriesData[1].value)*100).toFixed(2)+'%'; // 字符串形式的html标签会被echarts转换渲染成数据，这个res主要是画的tooltip里的上部分的标题部分
    
              return res; // 经过这么一加工，最终返回出去并渲染，最终就出现了我们所看的效果
            },
        }
    }
},
  legend: {
    data: ['计划值', '完成值'],
    right:60,
    top:24,
    y: 'center',
    itemGap:10,
    align:'left',
    orient: 'vertical',
    itemWidth:70,
    textStyle: {
      color: '#666',
      fontSize: 16,
      align: 'left',
      

    },
  },
  title: {
    text: '实际与计划对比图 ',
    left: 'center',
    textStyle:{
        fontSize:15
    },
  },
//   legend: {
//     data: ['销量']
//   },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月','4月', '5月', '6月','7月', '8月', '9月','10月', '11月', '12月'],
  },
  grid: {
    left: '5%',
    right: '15%',
    bottom: '8%',
    top: '10%',
    containLabel: true
},
  yAxis: {
     type: 'value',
    name: '数\n量\n(条)',
    nameLocation:'end',
    // align:'center',
    nameGap:-30,// 坐标轴名称与轴线之间的距离。
    // boundaryGap:['0%', '0%'],
    // nameRotate: 360, // 坐标轴名字旋转，角度值。
    nameTextStyle:{
		color:'#000',
		padding:[0,80,0,0],		//表示[上,右,下,左]的边距
	},
    splitLine :{    //网格线
        lineStyle:{
            type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
        },
        show:true //隐藏或显示
    }

  },

  series: [
    {
      name: '计划值',
      type: 'line',
      data: [174,5, 20, 46,90, 110, 146,15, 210, 116,59, 220],
      itemStyle: {
        // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
        normal: {
          // 柱形图圆角，初始化效果
          barBorderRadius: [2, 2, 0, 0]
        }
      },
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: '#5EB3F2'
        },
        {
          offset: 1,
          color: '#237FC4'
        }
      ])
    },
    {
      name: '完成值',
      type: 'line',
      data: [5, 20, 46,90, 110, 146,15, 210, 116,59, 220, 174],
      itemStyle: {
        // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
        normal: {
          // 柱形图圆角，初始化效果
          lineStyle: {
            color: "#A1A8B3",
            type: "dashed",//'dotted'虚线 'solid'实线
          },
        }
      }
    }
  ]
}

var myChartd={
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '10%',
    left: 'center',
    // doesn't perfectly work with our tricks, disable it
    selectedMode: false
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '85%'],
      // adjust the start angle
      startAngle: 180,
      label: {
        show: true,
        formatter(param:any) {
          // correct the percentage
          return param.name + ' (' + param.percent! * 2 + '%)';
        }
      },
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: 'Direct' },
        { value: 580, name: '邮件' },
        { value: 484, name: '工会广告' },
        { value: 300, name: '视频广告' },
        {
          // make an record to fill the bottom 50%
          value: 1048 + 735 + 580 + 484 + 300,
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none'
            }
          },
          label: {
            show: false
          }
        }
      ]
    }
  ]
}
//笛卡尔数据内容
const axisData = ['Mon', 'Tue', 'Wed', 'Very Loooong Thu', 'Fri', 'Sat', 'Sun'];
const data = axisData.map(function (item, i) {
  return Math.round(Math.random() * 1000 * (i + 1));
});
const links = data.map(function (item, i) {
  return {
    source: i,
    target: i + 1
  };
});
links.pop();
var myCharte={
  title: {
    text: '笛卡尔关系图'
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: axisData
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'graph',
      layout: 'none',
      coordinateSystem: 'cartesian2d',
      symbolSize: 40,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      data: data,
      links: links,
      lineStyle: {
        color: '#2f4554'
      }
    }
  ]
}

const chartData1 = ref<any>(mycharta)
const chartData2 = ref<any>(myChartb)
const chartData3 = ref<any>(myChartc)
const chartData4 = ref<any>(myChartd)
  const chartData5 = ref<any>(myCharte)
</script>

<style lang="less">
.cardListContainer{
  .el-col{
    margin-bottom: 10px;
  }
}
.cardBoxContainer{

  &>h1{
    font-size: 16px;
    color: #333;
    line-height: 30px;
    &>span{
      float: right;
      font-size: 12px;  
      font-weight: normal;
    }
    margin-bottom: 10px;
  }
  &>span{
    display: block;
    line-height: 2;
    font-size: 14px;
    padding-bottom: 10px;
    &>span{
      float: right;
    }
  }
}
</style>
