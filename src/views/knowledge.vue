<template>
  <div>
      <PageHead title="知识文章">
        <template #buttons>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </template>
      </PageHead>
      <TableSearch :formItem='formItem' @search="handleSearch"/>
      <el-table :data="tableData" style="width:100%;margin-top:25px">
        <el-table-column label="文章标题" fixed="left">
            <template #default="scope">
              <div style="display:flex;align-items:center">
                  <el-icon><Timer/></el-icon>
                  <span>{{scope.row.title}}</span>
              </div>
            </template>
        </el-table-column>

         <el-table-column label="分类" width="200">
            <template #default="scope">
              <div style="display:flex;align-items:center">
                  <el-icon><Timer/></el-icon>
                  <span>{{categoryMap[scope.row.categoryId]}}</span>
              </div>
            </template>
        </el-table-column>

      <el-table-column prop="authorName" label="作者" width="150px"/>
      <el-table-column prop="readCount" label="阅读量" width="150px"/>
      <el-table-column prop="createdAt" label="发布时间" width="150px"/>
      <el-table-column label="操作" width="240px" fixed="right"> 
        <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status===0 || scope.row.status===2" text type="success" @click="handlePublish(scope.row)">发布</el-button>
            <el-button v-if="scope.row.status===1" text type="warning" @click="handleOffline(scope.row)">下线</el-button>
            <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <div class="pagination-info">
        <el-pagination
          :current-page="pagination.currentPage"
          :page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
      <ArticleDialog v-model:modelValue="dialogVisible" :categories="categories" @confirm="handleArticleConfirm" :editData="currentArticle" :key="currentArticle?.id || 'add'"/>
      <!-- :key 只要key值改变 强制重构内部所有组件 -->
  </div>
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import {categoryTree,articlePage,articleAdd,getArticleDetail,updateArticle,changeArticleStatus,deleteArticle} from '../api/admin'
import { Timer } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import ArticleDialog from '../components/ArticleDialog.vue'

const formItem=[
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',placeholder:'请选择分类'},
  {comp:'select',prop:'status',label:'状态',placeholder:'请输入文章内容',options:[{
    label:'草稿',
    value:'0'
  },{
     label:'已发布',
    value:'1'
  },
  {
    label:'已下线',
    value:'2'
  }]}
]


// 表格数据
const tableData = ref([])

// 分页参数
const pagination = ref({
  currentPage:1,
  size:10,
  total:0
})
const handleSearch = async (data = {}) => {
  pagination.value.currentPage = 1
  await fetchData(data)
}

const handlePageChange = (page) => {
  pagination.value.currentPage = page
  fetchData()
}

const handleSizeChange = (size) => {
  pagination.value.size = size
  pagination.value.currentPage = 1
  fetchData()
}

const fetchData = async (data = {}) => {
  const params = {
    currentPage: pagination.value.currentPage,
    size: pagination.value.size,
    ...data
  }

  const res = await articlePage(params)
  console.log('接口返回：', res)
  tableData.value = res.records || res.list || res.rows || []
  pagination.value.total = res.total || res.totalCount || 0
}

const handlePublish = async (row) => {
  await changeArticleStatus(row.id, { status: 1 })
  ElMessage.success('发布成功')
  fetchData()
}

const handleOffline = async (row) => {
  await changeArticleStatus(row.id, { status: 2 })
  ElMessage.success('已下线')
  fetchData()
}

const handleDelete = async (row) => {
  await deleteArticle(row.id)
  ElMessage.success('删除成功')
  fetchData()
}

const categoryMap = ref({})
const categories = ref([])

// 得到分类下拉列表，并添加到options中
onMounted(async ()=>{
   const data=await categoryTree()
   console.log(data);
   
   categories.value=data.map(item=>{
    categoryMap.value[item.id] = item.categoryName
    return {
      label:item.categoryName,
      value:item.id
    }
   })
   formItem[1].options=categories.value
})

// 新增和编辑
const dialogVisible = ref(false)
const currentArticle = ref(null)

// 新增：清空 editData，打开弹窗
const handleAdd = () => {
  currentArticle.value = null
  dialogVisible.value = true
}

const handleArticleConfirm = async (data) => {
  console.log('提交的数据：', data)
  console.log(currentArticle.value);
  

  if (currentArticle.value?.id) {
    // 编辑模式：调用更新接口
    await updateArticle(currentArticle.value.id, data)
    ElMessage.success('编辑成功')
  } else {
    // 新增模式：调用新增接口
    await articleAdd(data)
    ElMessage.success('新增成功')
  }

  dialogVisible.value = false
  await fetchData()
  currentArticle.value = null
}

//编辑
const handleEdit=(row)=>{
  console.log('获取当前行的数据进行编辑',row);
  // 获取文章知识详情的接口要传id，没有id直接返回
  if(!row.id)return
  getArticleDetail(row.id).then(res=>{
    console.log(res);
    currentArticle.value=res
    dialogVisible.value=true
  })

  
}

</script>

<style>

</style>