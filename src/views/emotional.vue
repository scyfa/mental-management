<template>
    <div>
        <PageHead title="情绪日志"/>
        <TableSearch :formItem='formItem' @search="handleSearch"/>
        <el-table :data="tableData" style="width:100%">
            <el-table-column prop="id" label="用户ID" width="80"/>
            <el-table-column prop="modScore" label="会话ID" width="80">
                <template #default="scope">
                    <el-avatar>
                        {{scope.row.nickname}}
                    </el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="diaryDate" label="记录日期" width="100"/>
            <el-table-column prop="modScore" label="情绪评分" >
                <template #default="scope">
                    <el-rate :model-value="scope.row.moodScore" :max="10" disabled/>
                </template>
            </el-table-column>
            <el-table-column prop="modScore" label="生活指标" width="120">
                <template #default="scope">
                    <div>
                        <p>
                            睡眠:{{scope.row.sleepQuality}}/5
                        </p>
                        <p>
                            压力:{{scope.row.stressLevel}}
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120"/>
            <el-table-column prop="diaryContent" label="日记内容" width="250"/>
            <el-table-column label="操作" width="240px" fixed="right"> 
                <template #default="scope">
                    <el-button text type="primary" @click="viewSessionDetail(scope.row)">详情</el-button>
                    <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
          <el-pagination
          style="margin-top:25px"
          :page-size="pagination.size"
          layout="prev,pager,next"
          :total="pagination.total"
          @current-change="handleChange"
        />

        <el-dialog
        v-model="detailDialogVisible"
        title="情绪日志详情"
        width="800px"
        :close-on-click-modal="false"
        >
        <div v-if="currentDetail">
            <div class="detail-section">
                <h4>用户信息</h4>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="用户名">{{currentDetail.username}}</el-descriptions-item>
                    <el-descriptions-item label="昵称">{{currentDetail.nickname}}</el-descriptions-item>
                    <el-descriptions-item label="用户ID">{{currentDetail.userID}}</el-descriptions-item>
                    <el-descriptions-item label="记录日期">{{currentDetail.diaryData}}</el-descriptions-item>
                </el-descriptions>
            </div>
            <div class="detail-section">
                <h4>情绪状态</h4>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="情绪评分">
                        <el-rate :model-value="currentDetail.moodScore" :max="10" disabled/>
                    </el-descriptions-item>
                    <el-descriptions-item label="主要情绪">
                        <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{currentDetail.dominantEmotion||'-'}}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="睡眠质量">{{currentDetail.sleepQuality||'-'}}</el-descriptions-item>
                    <el-descriptions-item label="压力水平">{{currentDetail.stressLevel||'-'}}</el-descriptions-item>
                </el-descriptions>
            </div>
            <div class="detail-section">
                <h4>日记内容</h4>
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="情绪触发因素">{{currentDetail.emotionTriggers||'无'}}</el-descriptions-item>
                    <el-descriptions-item label="日记内容">{{currentDetail.diaryContent||'无'}}</el-descriptions-item>
                </el-descriptions>
            </div>
             <div class="detail-section" v-if="aiData">
                <h4>AI情绪分析结果</h4>
                  <el-descriptions :column="2" border>
                    <el-descriptions-item label="情绪状态">
                      <el-tag :type="getAiEmotionTagType(aiData.emotion)">{{aiData.emotion||'-'}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="情绪评分">
                      <span :style="{ color: getEmotionScoreColor(aiData.emotionScore) }">{{aiData.emotionScore||'-'}} 分</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="风险评估">
                      <el-tag :type="getRiskLevelTagType(aiData.riskLevel)">{{getRiskLevelText(aiData.riskLevel)}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="分析时间">{{aiData.analysisTime||'-'}}</el-descriptions-item>
                    <el-descriptions-item label="分析详情" :span="2">{{aiData.analysisDetail||aiData.summary||'无'}}</el-descriptions-item>
                </el-descriptions>
            </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="detailDialogVisible = false">关 闭</el-button>
          </div>
        </template>
        </el-dialog>
        
    </div>
</template>

<script setup >
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import { getEmotionPage, deleteEmotion } from '../api/admin'
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}



const formItem=[
    {comp:'input',prop:'userId',label:'用户ID',placeholder:'请输入用户ID'},
    {comp:'select',prop:'modScoreRange',label:'情绪评分',placeholder:'请选择评分范围',options:[{
      label:'低分(1-3)',
      value:'1-3'
    },
    {
        label:'中分(4-6)',
        value:'4-6'
    },
    {
        label:'高分(7-10)',
        value:'7-10'
    }

    ]}
]
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})
const tableData = ref([])
const allRecords = ref([])     // 存储所有原始数据
const searchForm = ref({})     // 当前筛选条件

// 搜索：保存筛选条件并重置页码
const handleSearch = (formData = {}) => {
  searchForm.value = formData
  pagination.currentPage = 1
  fetchData()
}

// 翻页
const handleChange = (page) => {
  pagination.currentPage = page
  applyFilter()
}

// 获取数据
const fetchData = async () => {
  const params = {
    currentPage: 1,
    size: 9999  // 获取所有数据（服务端不支持筛选，只能拉全量过滤）
  }
  const { records } = await getEmotionPage(params)
  allRecords.value = records || []
  applyFilter()
}

// 客户端过滤 + 分页
const applyFilter = () => {
  let filtered = [...allRecords.value]
  const { modScoreRange, userId } = searchForm.value

  // 按情绪评分范围过滤
  if (modScoreRange) {
    const [min, max] = modScoreRange.split('-').map(Number)
    filtered = filtered.filter(item => item.moodScore >= min && item.moodScore <= max)
  }
  // 按用户ID过滤（数字ID转字符串精确匹配）
  if (userId) {
    filtered = filtered.filter(item => String(item.id) === userId)
  }

  pagination.total = filtered.length
  const start = (pagination.currentPage - 1) * pagination.size
  tableData.value = filtered.slice(start, start + pagination.size)
}

// 详情
const  detailDialogVisible=ref(false)
const currentDetail = ref(null)
const aiData=ref(null)

const handleDelete = async (row) => {
  await deleteEmotion(row.id)
  ElMessage.success('删除成功')
  handleSearch()
}

const viewSessionDetail=(row)=>{
   currentDetail.value=row
   if(row.aiEmotionAnalysis){
    aiData.value=JSON.parse(row.aiEmotionAnalysis)
   }else{
    aiData.value={}
   }
   detailDialogVisible.value=true
}
onMounted(()=>{
    handleSearch()
})
    
</script>

<style lang="scss" scoped>
.detail-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 15px;
    font-weight: 600;
    padding-left: 8px;
    border-left: 3px solid #409eff;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>