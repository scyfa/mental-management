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
                    <el-button text type="danger">删除</el-button>
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
             <div class="detail-section">
                <h4>AI情绪分析结果</h4>
                  <el-descriptions :column="2" border>
                    <el-descriptions-item label="情绪触发因素">{{currentDetail.emotionTriggers||'无'}}</el-descriptions-item>
                    <el-descriptions-item label="日记内容">{{currentDetail.diaryContent||'无'}}</el-descriptions-item>
                </el-descriptions>
            </div>

        </div>
        </el-dialog>
        
    </div>
</template>

<script setup >
import {ref,onMounted,reactive} from 'vue'
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import {getEmotionPage} from '../api/admin'
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
const pagination=reactive({
    currentPage:1,
    size:10,
    total:0
})
const tableData=ref([])
const handleChange=(page)=>{
    pagination.currentPage=page
    handleSearch()
}
const handleSearch=async(formData)=>{
    const params = {
        currentPage: pagination.currentPage,
        size: pagination.size,
        ...formData
    }

    const {records,total}=await getEmotionPage(params)
    console.log(records);
    
    tableData.value=records
    pagination.total=total
}

// 详情
const  detailDialogVisible=ref(false)
const currentDetail = ref(null)
const aiData=ref(null)

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