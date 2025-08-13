<template>
  <div>

    <div :id="chartId" style="width: 100%;" :style="{height:chartHeight+'px'}"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, watch } from 'vue'

import type { Ref } from 'vue'
import { Guid } from "guid-typescript";
import { defineProps, toRefs,withDefaults } from 'vue'
//设置props默认值
const props = withDefaults(
  defineProps<{
    chartHeight?:number;
    chartData: Record<string, unknown>;
  }>(),
  {
    chartHeight: 320,
  }
)

let { chartData,chartHeight } = toRefs(props)

const chartId: Ref<string> = ref(Guid.create()?.value)

const initChart = () => {

  let getchart = echarts.init(document.getElementById(chartId.value));

  getchart.setOption(chartData?.value);
  //随着屏幕大小调节图表
  window.addEventListener("resize", () => {
    getchart.resize();
  });
}
onMounted(() => {
  initChart()
})

/*监听props 动态刷新chart*/
watch(props, (nweProps, oldProps) => {
  initChart()
})

</script>

<style lang="less">
</style>
