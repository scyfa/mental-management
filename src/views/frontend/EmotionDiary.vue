<template>
  <div class="emotion-diary-page">
    <!-- 顶部标题区 -->
    <section class="diary-hero">
      <div class="hero-content">
        <h1>📔 情绪日记</h1>
        <p>记录每一天的心情，更好地了解自己</p>
      </div>
    </section>

    <!-- 日记表单 -->
    <section class="diary-form-section">
      <el-card shadow="hover" class="form-card">
        <template #header>
          <span class="form-title">✍️ 记录今日心情</span>
        </template>
        <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
          <el-form-item label="记录日期" prop="diaryDate">
            <el-date-picker v-model="formData.diaryDate" type="date" placeholder="选择日期" style="width:100%"
              value-format="YYYY-MM-DD" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="情绪评分" prop="moodScore">
                <div class="score-selector">
                  <el-rate v-model="formData.moodScore" :max="10" :texts="scoreTexts" show-text allow-half />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主要情绪" prop="dominantEmotion">
                <el-select v-model="formData.dominantEmotion" placeholder="请选择你的情绪" style="width:100%">
                  <el-option v-for="item in emotionOptions" :key="item.value" :label="item.label" :value="item.value">
                    <span>{{ item.icon }} {{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="睡眠质量" prop="sleepQuality">
                <el-rate v-model="formData.sleepQuality" :max="5" show-text :texts="sleepTexts" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="压力水平" prop="stressLevel">
                <el-slider v-model="formData.stressLevel" :min="1" :max="10" :marks="stressMarks" show-input />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="情绪触发因素" prop="emotionTriggers">
            <el-input v-model="formData.emotionTriggers" placeholder="比如：工作压力、人际关系、学习焦虑..."
              maxlength="200" show-word-limit />
          </el-form-item>

          <el-form-item label="日记内容" prop="diaryContent">
            <el-input v-model="formData.diaryContent" type="textarea" :rows="6"
              placeholder="今天发生了什么？你的感受如何？写下你想说的一切..."
              :maxlength="2000" show-word-limit />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" class="submit-btn" @click="handleSubmit">
              💾 保存日记
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </section>

    <!-- 情绪知识 & 放松技巧 -->
    <section class="tips-section">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(tip, idx) in wellnessTips" :key="idx">
          <el-card shadow="hover" class="tip-card">
            <div class="tip-icon">{{ tip.icon }}</div>
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-desc">{{ tip.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {logemotionDiary} from '../../api/frontend'

const formRef = ref(null)

const scoreTexts = ['😡', '😠', '😞', '😟', '😐', '🙂', '😊', '😄', '😁', '🥰']
const sleepTexts = ['很差', '较差', '一般', '良好', '优秀']
const stressMarks = { 1: '轻松', 5: '适中', 10: '极大' }

const emotionOptions = [
  { value: '快乐', icon: '😊', label: '快乐' },
  { value: '平静', icon: '😌', label: '平静' },
  { value: '焦虑', icon: '😰', label: '焦虑' },
  { value: '悲伤', icon: '😢', label: '悲伤' },
  { value: '愤怒', icon: '😡', label: '愤怒' },
  { value: '兴奋', icon: '🤩', label: '兴奋' },
  { value: '沮丧', icon: '😞', label: '沮丧' },
  { value: '满足', icon: '😊', label: '满足' }
]

const formData = reactive({
  diaryDate: '',
  moodScore: 5,
  dominantEmotion: '',
  sleepQuality: 3,
  stressLevel: 5,
  emotionTriggers: '',
  diaryContent: ''
})

const rules = {
  diaryDate: [{ required: true, message: '请选择记录日期', trigger: 'change' }],
  moodScore: [{ required: true, message: '请给今天的心情打分', trigger: 'change' }],
  dominantEmotion: [{ required: true, message: '请选择主要情绪', trigger: 'change' }],
  diaryContent: [
    { required: true, message: '请输入日记内容', trigger: 'blur' },
    { min: 10, message: '至少写10个字吧~', trigger: 'blur' }
  ]
}

const getEmotionTagType = (emotion) => {
  const map = { '快乐': 'success', '平静': 'info', '焦虑': 'warning', '悲伤': '', '愤怒': 'danger', '兴奋': 'warning', '满足': 'success', '沮丧': 'info' }
  return map[emotion] || 'info'
}

const wellnessTips = [
  { icon: '🧘', title: '正念呼吸', desc: '闭上眼睛，深吸一口气，感受空气流经鼻腔，慢慢呼出。重复5次，让身心回归平静。' },
  { icon: '📝', title: '感恩练习', desc: '每天写下3件让你感到感恩的事，哪怕再小，也能帮你发现生活中的美好。' },
  { icon: '🚶', title: '身体运动', desc: '哪怕是10分钟的快走，也能释放多巴胺，让情绪变得更好。运动是最好的情绪调节剂。' },
  { icon: '💬', title: '与人倾诉', desc: '不要把情绪憋在心里，找一个信任的人聊聊，或打开AI助手，让交流带走你的烦恼。' },
  { icon: '🎵', title: '音乐疗法', desc: '听一首喜欢的音乐，让旋律带走你的忧愁。轻音乐和自然声音尤其有助于放松。' },
  { icon: '☀️', title: '阳光补充', desc: '每天晒15分钟太阳，促进维生素D合成，改善情绪。清晨的阳光效果最好。' }
]

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      logemotionDiary({ ...formData }).then(() => {
        ElMessage.success('日记保存成功')
        resetForm()
        loadDiaryList()
      })
    }
  })
}

const resetForm = () => {
  formData.diaryDate = ''
  formData.moodScore = 5
  formData.dominantEmotion = ''
  formData.sleepQuality = 3
  formData.stressLevel = 5
  formData.emotionTriggers = ''
  formData.diaryContent = ''
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.emotion-diary-page {
  min-height: calc(100vh - 200px);
  background: linear-gradient(180deg, #f0f7f5 0%, #fafcfb 40%, #fff 100%);
  padding: 20px;

  .diary-hero {
    text-align: center;
    padding: 50px 20px 40px;
    .hero-content {
      h1 {
        font-size: 36px;
        color: #2c3e50;
        margin-bottom: 10px;
      }
      p {
        font-size: 16px;
        color: #7f8c8d;
      }
    }
  }

  .form-card {
    max-width: 800px;
    margin: 0 auto 30px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 24px rgba(74, 156, 140, 0.08);

    .form-title {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }

    .score-selector {
      padding-top: 8px;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4A9C8C, #3D8A7A);
      border: none;
      &:hover {
        background: linear-gradient(135deg, #3d8a7a, #2e6e60);
      }
    }
  }

  .tips-section {
    max-width: 1000px;
    margin: 0 auto 40px;

    .tip-card {
      border-radius: 14px;
      border: 1px solid rgba(74, 156, 140, 0.08);
      text-align: center;
      height: 100%;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(74, 156, 140, 0.12);
      }

      .tip-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }

      .tip-title {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 8px;
      }

      .tip-desc {
        font-size: 13px;
        color: #7f8c8d;
        line-height: 1.6;
      }
    }
  }
}
</style>
