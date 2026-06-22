<template>
   <el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="24">
          <template v-for="item in formItemAttrs" :key="item.prop">
            <el-col v-bind="item.col">
           <el-form-item :label="item.label" :prop="item.prop">
           <el-input v-if="item.comp==='input'" v-model="formData[item.prop]" :placeholder="item.placeholder" />
           <el-select v-else-if="item.comp==='select'" v-model="formData[item.prop]" :placeholder="item.placeholder" teleported :popper-options="{ placement: 'bottom-start', strategy: 'fixed' }">
             <el-option label="全部" value=""/>
             <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value"/>
           </el-select>
           </el-form-item>
           </el-col>
       </template>
    </el-row>
    <el-row>
        <el-button type="primary" @click="handleSearch"> 查询</el-button>
        <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
    </el-form>
</template>
<script setup>
import { reactive, computed, ref, watch } from 'vue'

const ruleFormRef = ref(null)
const formData = reactive({})

const emit = defineEmits(['search'])

const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})

// 基于 formItem 初始化 formData 字段（保证响应式跟踪）
watch(
  () => props.formItem,
  (items) => {
    items.forEach(item => {
      if (!(item.prop in formData)) {
        formData[item.prop] = ''
      }
    })
  },
  { immediate: true, deep: true }
)

const formItemAttrs = computed(() => {
  return props.formItem.map(item => ({
    ...item,
    col: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6
    }
  }))
})
// const isComp=(comp)=>{
//     return{
//         input:'el-input',
//         select:'el-select'
//     }[comp]
// }

const handleSearch=()=>{
   emit('search',formData)
}

const handleReset=(formEl)=>{
  if(!formEl)return
  formEl.resetFields()
   emit('search',formData)
}

</script>