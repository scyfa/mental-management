<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="680px"
    @close="handleClose"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="formData.summary" type="textarea" :rows="4" placeholder="请输入文章摘要" maxlength="1000" show-word-limit />
      </el-form-item>

      <el-form-item label="文章标签" prop="tags">
        <el-select v-model="formData.tags" placeholder="请选择或输入文章标签" multiple filterable allow-create default-first-option style="width:100%">
            <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
      </el-form-item>

      <el-form-item label="封面图片" prop="coverImage">
        <el-upload
          class="cover-upload"
          :show-file-list="false"
          :before-upload="beforeCoverUpload"
          :http-request="handleCoverUpload"
        >
          <img v-if="formData.coverImage" :src="formData.coverImage" class="cover-preview" />
          <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="正文内容" prop="content">
        <RichTextEditor v-model="formData.content" 
        :placeholder="'请输入文章内容，支持富文本格式\n\n可以使用加粗，斜体，列表，标题等格式来丰富文章内容'"
        :maxCharCount="5000"
        @change="handleContentChange"
        @created="handleEditorCreated"
        min-height="400px"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// ==================== 1. 依赖导入 ====================
import { computed, reactive, ref ,nextTick,watch} from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {uploadFile} from '../api/admin'
import {FileBaseUrl} from '../config/index'
import RichTextEditor from './RichTextEditor.vue'
// ==================== 2. Props & Emits ====================
const props = defineProps({
  modelValue: {          // 控制弹窗显示/隐藏
    type: Boolean,
    default: false
  },
  categories: {          // 分类下拉选项
    type: Array,
    default: () => []
  },
  editData: {            // 编辑时传入的文章数据
    type: Object,
    default: () => null
  }
})

const emit = defineEmits([
  'update:modelValue',   // v-model 双向绑定事件
  'confirm'              // 确认提交事件
])

// ==================== 3. 计算属性 ====================
// 是否编辑模式
const isEdit = computed(() => !!props.editData)

// v-model 双向绑定桥接
const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

// ==================== 4. 表单相关 ====================
const formRef = ref(null)

// 表单默认值（用于重置）
const defaultFormData = {
  categoryId: '',
  title: '',
  summary: '',
  tags: [],
  coverImage: '',
  content: ''
}

// 表单数据
const formData = reactive({ ...defaultFormData })

// 监听 editData，编辑时回显数据
watch(
  () => props.editData,
  (data) => {
    if (data) {
      // 编辑模式：回填数据
      formData.categoryId = data.categoryId || ''
      formData.title = data.title || ''
      formData.summary = data.summary || ''
      // tags 后端是逗号分隔字符串，转为数组给 el-select
      formData.tags = data.tags ? data.tags.split(',').filter(Boolean) : []
      formData.coverImage = FileBaseUrl+data.coverImage
      formData.content = data.content || ''
    } else {
      // 新增模式：重置表单
      Object.assign(formData, defaultFormData)
      formRef.value?.resetFields()
    }
  },
  { immediate: true }
)

// 表单校验规则
const rules = {
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 200, message: '标题不超过200个字符', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入摘要', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入正文内容', trigger: 'blur' }
  ]
}

// ==================== 5. 弹窗操作 ====================
// 关闭弹窗
const handleClose = () => {
  Object.assign(formData, defaultFormData)
  formRef.value?.resetFields()
  emit('update:modelValue', false)
}

// 确认提交
const handleConfirm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      const submitData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags
      }
      emit('confirm', submitData)
      handleClose()
    }
  })
}

// ==================== 6. 封面上传 ====================

// 上传前校验
const beforeCoverUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
  }
  return isImage && isLt5M
}

const businessId=ref(null)
// 自定义上传（使用 axios，走请求/响应拦截器）
const handleCoverUpload = async ({file}) => {
    businessId.value=crypto.randomUUID()
   const fileRes=await uploadFile(file,{
    businessId:businessId.value
   })
   console.log(fileRes);
   formData.coverImage=`${FileBaseUrl}${fileRes.filePath}`
}

// ==================== 7. 预设数据 ====================
// 常用标签列表
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

// 富文本
const handleContentChange=(data)=>{
  formData.content=data.html
}
const editorInstance=ref(null)
const handleEditorCreated=(editor)=>{
  editorInstance.value=editor
  if(formData.content&&editor){
    nextTick(()=>{
      editor.setHtml(formData.content)
    })
  }

}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cover-upload {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 178px;
    height: 178px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s;

    &:hover {
      border-color: #409eff;
    }
  }
}

.cover-preview {
  width: 178px;
  height: 178px;
  object-fit: cover;
  border-radius: 6px;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
