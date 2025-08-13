import { computed, ref } from 'vue'
import * as api from "@/api"
/**
 * 封装获取列表
 * @param {string|Ref<string>} moduleName 请求地址
 * @param {boolean} immediate 是否在初始化时加载，默认: `true`
 */
export default function dataList({ moduleName, immediate = true }: { moduleName: string, immediate?: boolean }) {
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const query = ref<any>({})
  const sortField = ref('create_time')
  const sortType = ref('desc')

  // 组合请求信息，当前是以get方法的query参数为例
  const payload = computed(() => {
    const _query = query.value
    return Object.assign({}, {data:_query}, {
      pageIndex: page.value, // 请求的当前页字段
      pageSize: limit.value, // 请求的条数字段
      sortField:sortField.value,
      sortType:sortType.value
    })
  })
  const list:any = ref([])

  immediate && loadList()

  async function loadList() {
    const result = await (api[moduleName as keyof typeof api] as any).getList(payload.value)
    list.value = result?.items as any
    total.value = result?.total as number || 0
  }
  //查询分页 重置当前页码与列表数据
  function search() {
    page.value = 1
    list.value = []
    loadList()
  }
  function changePageSize(pageSize:number){
    limit.value=pageSize
    list.value = []
    loadList()
  }

  // 对外暴露参数与方法
  return {
    sortField,
    sortType,
    query,
    page,
    limit,
    total,
    list,
    loadList,
    search,
    changePageSize,
  }
}

