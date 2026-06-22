<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar users">
              <el-image style="width:40px;height:40px" :src="iconUrl1" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ overview.totalUsers || 0 }}</p>
              <p class="subtitle-title">活跃用户：{{ overview.activeUsers || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar like">
              <el-image style="width:40px;height:40px" :src="iconUrl2" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ overview.totalDiaries || 0 }}</p>
              <p class="subtitle-title">今日新增：{{ overview.todayNewDiaries || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar comments">
              <el-image style="width:40px;height:40px" :src="iconUrl3" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ overview.totalSessions || 0 }}</p>
              <p class="subtitle-title">今日新增：{{ overview.todayNewSessions || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar smile">
              <el-image style="width:40px;height:40px" :src="iconUrl4" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ overview.avgMoodScore || 0 }}</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">情绪趋势（近7天）</span>
          </template>
          <div ref="trendChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">情绪分布</span>
          </template>
          <div ref="emotionPieRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">情绪评分统计</span>
          </template>
          <div ref="scoreBarRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getAnalyticsOverview } from '../api/admin'

const iconUrl1 = new URL('../assets/users.png', import.meta.url).href
const iconUrl2 = new URL('../assets/like.png', import.meta.url).href
const iconUrl3 = new URL('../assets/comments.png', import.meta.url).href
const iconUrl4 = new URL('../assets/smile.png', import.meta.url).href

const overview = ref({})
const trendChartRef = ref(null)
const emotionPieRef = ref(null)
const scoreBarRef = ref(null)

onMounted(async () => {
  const res = await getAnalyticsOverview()
  console.log('概览数据：', res)
  overview.value = res?.systemOverview || res || {}

  await nextTick()
  initTrendChart()
  initEmotionPie()
  initScoreBar()
})

// 情绪趋势折线图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  const chart = echarts.init(trendChartRef.value)

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['情绪评分', '睡眠质量'], top: 0, left: 'center' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
    xAxis: {
      type: 'category',
      data: overview.value.trendDates || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value', max: 10 },
    series: [
      {
        name: '情绪评分',
        type: 'line',
        data: overview.value.trendMoodScores || [6.5, 7.0, 5.5, 7.2, 6.8, 7.5, 8.0],
        smooth: true,
        itemStyle: { color: '#409eff' },
        areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
      },
      {
        name: '睡眠质量',
        type: 'line',
        data: overview.value.trendSleepScores || [3.5, 4.0, 3.0, 4.2, 3.8, 4.5, 4.0],
        smooth: true,
        itemStyle: { color: '#67c23a' },
        areaStyle: { color: 'rgba(103, 194, 58, 0.1)' }
      }
    ]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 情绪分布饼图
const initEmotionPie = () => {
  if (!emotionPieRef.value) return
  const chart = echarts.init(emotionPieRef.value)

  const data = overview.value.emotionDistribution || [
    { name: '快乐', value: 35 },
    { name: '平静', value: 28 },
    { name: '焦虑', value: 18 },
    { name: '悲伤', value: 10 },
    { name: '愤怒', value: 5 },
    { name: '其他', value: 4 }
  ]

  const option = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 10, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      data,
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      },
      label: { formatter: '{b}: {c} ({d}%)' }
    }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 情绪评分柱状图
const initScoreBar = () => {
  if (!scoreBarRef.value) return
  const chart = echarts.init(scoreBarRef.value)

  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['人数'],
      top: 0,
      left: 'center'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
    xAxis: {
      type: 'category',
      data: overview.value.scoreRanges || ['1-3分', '4-5分', '6-7分', '8-9分', '10分']
    },
    yAxis: { type: 'value' },
    series: [{
      name: '人数',
      type: 'bar',
      data: overview.value.scoreCounts || [12, 28, 45, 30, 8],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#409eff' },
          { offset: 1, color: '#79bbff' }
        ])
      },
      barMaxWidth: 50
    }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}
</script>

<style lang="scss">
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .number {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-box {
      width: 100%;
      height: 400px;
    }

    .chart-content {
      padding: 20px;
      height: 300px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }

</style>