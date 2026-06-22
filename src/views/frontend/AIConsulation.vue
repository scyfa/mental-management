<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconUrl" style="width:25px;height:25px"></el-image>
        </div>
        <h3 class="assistant-name">AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <!-- <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          
        </div>
      </div> -->


      <!-- 会话列表 -->
      <div class="session-history">
        <h4 class="section-title">会话历史</h4>
        <div class="session-list">
          <div v-for="session in sessionList" :key="session.id" @click="handlesessionclick(session)" class="session-item" >
            <el-icon class="delete-icon" @click.stop="handleDeleteSession(session)"><Delete /></el-icon>
            <div class="session-info">
              <div class="session-title">
                <span>{{session.sessionTitle}}</span>
                <div class="session-meta">
                  <span class="session-time">{{session.startedAt}}</span>
                </div>
                <div class="session-preview">
                  {{session.lastMessageContent}}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon>
                      <ChatRound/>
                    </el-icon>
                    {{session.messageCount||0}}
                  </span>
                  <span>
                    <el-icon>
                      <Clock/>
                    </el-icon>
                    {{session.durationMinutes||0}}分钟
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 情绪花园 -->
      <div class="emotion-garden" v-if="emotionData">
        <div class="garden-header">
          <span class="garden-title">🌿 情绪花园</span>
        </div>

        <!-- 当前情绪状态 -->
        <div class="emotion-info">
          <span class="emotion-name">{{ emotionData.emotion || '平静' }}</span>
          <span class="emotion-score">{{ emotionData.emotionScore || 0 }}分</span>
        </div>

        <!-- 暖心建议 -->
        <div class="warm-tips" v-if="emotionData.suggestion">
          <div class="emotion-status-text">
            <span class="status-label">当前状态：</span>
            <span class="status-emotion">{{ emotionData.emotion || '平静' }}</span>
          </div>
          <div class="emotion-intensity" v-if="emotionData.intensity">
            <span class="intensity-text">情绪强度</span>
            <div class="intensity-dots">
              <span v-for="i in 5" :key="i" class="dot" :class="{ active: i <= emotionData.intensity }"></span>
            </div>
          </div>
          <div class="warm-suggestion">
            <span class="suggestion-icon">💡</span>
            <div class="suggestion-content">
              <div class="suggestion-title">暖心建议</div>
              <div class="suggestion-text">{{ emotionData.suggestion }}</div>
            </div>
          </div>
        </div>

        <!-- 疗愈行动 -->
        <div class="healing-actions" v-if="emotionData.improvementSuggestions && emotionData.improvementSuggestions.length">
          <div class="actions-title">🌸 疗愈小行动</div>
          <div class="actions-list">
            <div v-for="(action, idx) in emotionData.improvementSuggestions" :key="idx" class="action-item">
              <span class="action-index">{{ idx + 1 }}</span>
              <span class="action-text">{{ action }}</span>
            </div>
          </div>
        </div>

        <!-- 风险提示 -->
        <div class="risk-notice" v-if="emotionData.riskLevel >= 2">
          <span class="notice-icon">⚠️</span>
          <div class="notice-content">
            <div class="notice-title">需要关注</div>
            <div class="notice-text">{{ emotionData.riskNotice || '您的情绪状态需要特别关注，建议寻求专业帮助。' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
               <el-image :src="iconUrl1" style="width:25px;height:25px"></el-image>
          </div>
          <div class="chat-info">
            <h2>AI助手</h2>
            <p>您贴心的AI心理健康助手</p>
          </div>
        </div>

        <el-button circle @click="createNewFrontendSession" title="新建会话">
        <el-icon>
          <Plus/>
        </el-icon>
        </el-button>

      </div>
      <div class="chat-messages">
        <div class="message-item ai-message" v-if="message.length===0">
          <div class="message-avatar">
            <el-image :src="iconUrl" style="width:18px;height:18px"/>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>您好，我是您的AI心理助手，很高兴陪伴您，为您提供温暖的心理支持,请告诉我，今天您感觉怎么样？有什么想要分享的吗?</p>
            </div>
            <div class="message-time">
              刚刚
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div v-for="msg in message" :key="msg.id" class="message-item" :class="msg.senderType === 1 ? 'user-message' : 'ai-message'">
          <div class="message-avatar">
            <el-image v-if="msg.senderType === 1" :src="iconUrl1" style="width:18px;height:18px" />
            <el-image v-else :src="iconUrl" style="width:18px;height:18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>{{ msg.content }}</p>
            </div>
            <div class="message-time">{{ msg.createdAt }}</div>
          </div>
        </div>
      </div>


      <div class="chat-input">
        <div class="input-container">
          <el-input
          v-model="userMessage"
          placeholder="请输入您想要分享的内容..."
          type="textarea"
          :rows="3"
          :disabled="isAiTying"
          :maxlength="500"
          show-word-limit
          @keydown="handleKeyDown"
          class="message-input"
          clearable
          />

        </div>
        <el-button type="primary" :disabled="userMessage.trim().length > 500 || isAiTying" @click="sendMessage" class="send-btn">
          <el-icon>
            <Promotion/>
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChatRound, Clock, Delete, Plus, Promotion } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { deleteSession, getSessionList, startSession ,getSessionData,getSessionEmotion} from '../../api/frontend'
import {fetchEventSource} from'@microsoft/fetch-event-source'

const iconUrl = new URL('../../assets/robot-fill.png', import.meta.url).href
const iconUrl1 = new URL('../../assets/like.png', import.meta.url).href

// 确保 sessionId 以 session_ 开头
const ensureSessionId = (id) => {
  return id && !String(id).startsWith('session_') ? `session_${id}` : String(id)
}



// 新建会话
const createNewFrontendSession=()=>{
    const newSession={
      sessionId:`temp_${Date.now()}`,
      status:'TEMP',
      sessionTitle:'新对话'
    }
    currentSession.value = newSession
    message.value = []
    emotionData.value = null
}

// 定义当前会话对象
const currentSession=ref(null)
// 定义对话消息
const message=ref([])

const sessionList = ref([])
const emotionData = ref(null)

// 用户输入消息
const userMessage = ref('')
const isAiTying=ref(false)

const handleKeyDown=(e)=>{
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
  }
}

const sendMessage=()=>{
  if(!userMessage.value.trim())return
  if(isAiTying.value){
    ElMessage.error('AI助手正在输入中,请稍后')
    return
  }
  const msg = userMessage.value.trim()
  userMessage.value = ''

  // 先把用户消息加入列表，即时渲染
  message.value.push({
    id: Date.now(),
    content: msg,
    senderType: 1,
    createdAt: new Date().toLocaleString()
  })

  if (currentSession.value?.status === 'TEMP') {
    startNewSession(msg)
  } else {
    startAIResponse(ensureSessionId(currentSession.value.sessionId || currentSession.value.id), msg)
  }
}
const startNewSession=(message)=>{
  const sessionParams={
    initialMessage:message
  }
  if(currentSession.value?.sessionTitle==='新对话'){
    sessionParams.sessionTitle=`AI助手-${new Date().toLocaleString()}`
  }else{
    // 如果是历史会话
    sessionParams.sessionTitle = currentSession.value?.sessionTitle
  }
  startSession(sessionParams).then(res=>{

    console.log('&&&',res);
    
    const sessionData={
      sessionId: res.sessionId,
      status:res.status,
      sessionTitle:sessionParams.sessionTitle
    }

    if(currentSession.value&&currentSession.value.status==='TEMP'){
      currentSession.value = { ...currentSession.value, ...sessionData }
    }else{
      currentSession.value=sessionData
    }

    console.log('&&&&', currentSession);
    
    // 更新会话列表
    getsessionPage()
    startAIResponse(ensureSessionId(currentSession.value.sessionId), message)
  })

}


const startAIResponse=(sessionId,userMessage)=>{
  // 防止重复发送
  if(isAiTying.value){
    ElMessage.error('AI助手正在输入中....')
    return
  }
  isAiTying.value=true
  const aiMessage={
    id:`ai_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
    senderType:2,
    content:'',
    createAt:new Date().toISOString()
  }
  message.value.push(aiMessage)

  // 调用流式接口
  const ctrl=new AbortController()   //用来终止fetch请求
  fetchEventSource('/api/psychological-chat/stream',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Token':localStorage.getItem('token'),
      'Accept':'text/event-stream'
    },
    body:JSON.stringify({
      sessionId,
      userMessage
    }),
    signal:ctrl.signal,
    onopen:(response)=>{
      if(response.headers.get('Content-Type')!=='text/event-stream'){
        ElMessage.error('服务器返回非流式数据')
      }
    },
    onmessage:(event)=>{
        const raw=event.data.trim()
        if(!raw)return
        const eventName=event.event
        const aiMessage= message.value[message.value.length-1]

        if(eventName==='done'){
          isAiTying.value = false
          ctrl.abort()
          // 自动拉取最新情绪数据
          if (sessionId) {
            getSessionEmotion(ensureSessionId(sessionId)).then(emotionRes => {
              emotionData.value = emotionRes || null
            }).catch(() => {})
          }
          return
        }
        const payload=JSON.parse(raw)
        const ok = payload.code === 200 || payload.code === '200'
        if(ok&&payload.data&&payload.data.content){
          aiMessage.content+=payload.data.content
        }else if(!ok){
          // 错误回复的显示
          handleError(payload.message||'AI回复失败')
        }
    },
    onerror:(err)=>{
      handleError('AI回复失败')
      ctrl.abort()
      throw err
    },
    onclose:()=>{
      isAiTying.value = false
    }
  })

}

const handleError=(error)=>{
     const aiMessage= message.value[message.value.length-1]
    if(aiMessage){
      aiMessage.content='AI回复失败,请重试'
    }
    isAiTying.value=false
    ElMessage.error('AI回复失败,请重试')
}

const getsessionPage = () => {
  getSessionList({
    pageNum: 1,
    pageSize: 10
  }).then(res => {
    console.log('@@@', res)
    sessionList.value = res.records
    // 自动加载最近一次会话的情绪数据
    if (res.records && res.records.length > 0) {
      getSessionEmotion(ensureSessionId(res.records[0].id)).then(emotionRes => {
        emotionData.value = emotionRes || null
      }).catch(() => {})
    }
  })
}

// 点击会话记录，加载消息
const handlesessionclick = async (session) => {
  message.value = []  // 先清空旧消息
  emotionData.value = null
  if (!session.id) return

  currentSession.value = {
    sessionId: ensureSessionId(session.id),
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle
  }

  try {
    const res = await getSessionData(session.id)
    console.log('#### messages', res)
    message.value = res.messages || res.records || res || []
  } catch {
    ElMessage.error('加载会话消息失败')
  }

  // 单独拉取情绪数据
  try {
    
    const emotionRes = await getSessionEmotion(ensureSessionId(session.id))
    console.log('#### emotion', emotionRes)
    emotionData.value = emotionRes || null
  } catch {
    // 情绪数据加载失败不阻塞
  }
}

const handleDeleteSession = (session) => {
  ElMessageBox.confirm(`确定要删除会话"${session.sessionTitle}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSession(session.id).then(() => {
      // console.log('@@@@',session.sessionId);
      ElMessage.success('删除成功')
      if (String(currentSession.value?.sessionId) === String(session.id)) {
        createNewFrontendSession()
      }
      getsessionPage()
    })
  }).catch(() => {})
}

onMounted(()=>{
  createNewFrontendSession()
  getsessionPage()
})
</script>
<style lang="scss" scoped>
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fb923c, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    .delete-icon {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        font-size: 14px;
                        color: #ccc;
                        cursor: pointer;
                        z-index: 1;
                        &:hover {
                            color: #f56c6c;
                        }
                    }
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 14px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, #fff 0%, #fef9f0 100%);
                            border-radius: 14px;
                            padding: 14px 12px;
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                            border: 1px solid rgba(251, 146, 60, 0.15);
                            box-shadow: 0 3px 12px rgba(251, 146, 60, 0.08);
                            transition: all 0.25s ease;
                            cursor: default;
                            &:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.15);
                                border-color: rgba(251, 146, 60, 0.3);
                            }
                            .action-index {
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #fb923c, #f59e0b);
                                color: #fff;
                                font-size: 12px;
                                font-weight: 700;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-shrink: 0;
                                box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
                            }
                            .action-text {
                                font-size: 13px;
                                color: #5c4a3a;
                                line-height: 1.5;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }
                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }
        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }
            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
  
@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes typing {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-4px); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>