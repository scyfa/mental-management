<template>
  <div class="knowledge-page">
    <!-- 顶部标题区 -->
    <section class="knowledge-hero">
      <div class="hero-content">
        <h1>📚 心理健康知识库</h1>
        <p>学习专业的心理知识，更好地照顾自己的情绪与心灵</p>
      </div>
    </section>

    <!-- 左侧导航 + 右侧内容 -->
    <section class="knowledge-body">
      <aside class="knowledge-sidebar">
        <el-menu :default-active="activeIndex" @select="handleMenuSelect">
          <el-menu-item v-for="item in knowledgeList" :key="item.id" :index="String(item.id)">
            <span>{{ item.icon }}</span>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <main class="knowledge-main">
        <div class="article-reader" v-if="currentArticle">
          <h2 class="reader-title">{{ currentArticle.title }}</h2>
          <div class="reader-tags">
            <el-tag v-for="tag in currentArticle.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
          </div>
          <div class="reader-section" v-for="(section, idx) in currentArticle.sections" :key="idx">
            <h3>{{ section.heading }}</h3>
            <p v-for="(text, i) in section.paragraphs" :key="i">{{ text }}</p>
          </div>
          <div class="reader-tips" v-if="currentArticle.tips">
            <div class="tips-header">💡 实用建议</div>
            <ul>
              <li v-for="(tip, i) in currentArticle.tips" :key="i">{{ tip }}</li>
            </ul>
          </div>
        </div>
      </main>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeIndex = ref('1')

const knowledgeList = [
  {
    id: 1,
    icon: '😰',
    title: '如何应对焦虑',
    tags: ['焦虑', '情绪管理', '自助方法'],
    tips: [
      '每天进行 5-10 分钟的正念冥想，专注当下的呼吸',
      '把让你焦虑的事情写在纸上，有助于理清思绪',
      '限制咖啡因摄入，特别是下午和晚上',
      '保持规律的作息时间，充足的睡眠有助于缓解焦虑'
    ],
    sections: [
      {
        heading: '什么是焦虑',
        paragraphs: [
          '焦虑是人类面对压力时的一种自然反应。适度的焦虑有助于我们保持警觉、应对挑战。但当焦虑过度、持续时间过长时，它会干扰日常生活，甚至演变为焦虑障碍。',
          '焦虑的常见表现包括：持续紧张不安、心跳加快、失眠、注意力难以集中、肌肉紧绷等。理解焦虑是应对焦虑的第一步。'
        ]
      },
      {
        heading: '焦虑的常见原因',
        paragraphs: [
          '现代生活节奏快、工作压力大、人际关系复杂，这些都可能引发焦虑。过度使用社交媒体、信息过载也会加剧焦虑感。',
          '此外，遗传因素、创伤经历、慢性疾病等也可能使人更容易产生焦虑。重要的是认识到，焦虑并不可耻，它就像心理的感冒，每个人都有可能遇到。'
        ]
      },
      {
        heading: '有效应对策略',
        paragraphs: [
          '认知行为疗法（CBT）是目前最为有效的心理干预方法之一。它帮助人们识别并调整引发焦虑的负面思维模式。',
          '深呼吸练习是迅速缓解焦虑的好方法。尝试"4-7-8 呼吸法"：吸气 4 秒，屏气 7 秒，缓慢呼气 8 秒，重复 3-5 次。',
          '规律的有氧运动能促进大脑分泌内啡肽和多巴胺，是天然的抗焦虑良药。每周 3-5 次、每次 30 分钟的中等强度运动就能带来明显改善。'
        ]
      },
      {
        heading: '何时寻求专业帮助',
        paragraphs: [
          '如果焦虑持续数周以上，严重影响到工作、学习或社交，建议及时寻求心理咨询师或精神科医生的帮助。',
          '专业的心理治疗和药物干预可以非常有效地控制焦虑症状。记住：求助不是软弱，而是对自己负责的勇敢行为。'
        ]
      }
    ]
  },
  {
    id: 2,
    icon: '😴',
    title: '改善睡眠质量',
    tags: ['睡眠', '生活习惯', '放松'],
    tips: [
      '每天固定时间上床和起床，即使是周末也尽量保持一致',
      '睡前 1 小时关闭电子设备，蓝光会抑制褪黑素分泌',
      '卧室温度保持在 18-22°C，保持安静和黑暗',
      '如果躺在床上超过 20 分钟睡不着，起身做一些放松的事'
    ],
    sections: [
      {
        heading: '睡眠的重要性',
        paragraphs: [
          '睡眠是身体和心理恢复的关键时期。在深度睡眠阶段，大脑会清理代谢废物、巩固记忆、调节情绪。成年人每晚需要 7-9 小时的优质睡眠。',
          '长期睡眠不足不仅会导致疲劳、注意力下降，还会增加抑郁、焦虑的风险，削弱免疫系统。'
        ]
      },
      {
        heading: '建立健康的睡眠习惯',
        paragraphs: [
          '创造舒适的睡眠环境是关键。使用遮光窗帘、白噪音或耳塞来减少干扰。睡前进行放松仪式，如泡热水澡、阅读纸质书、轻柔拉伸等。',
          '避免在睡前大量进食、饮酒或摄入咖啡因。酒精看似助眠，但会严重破坏后半夜的睡眠质量。',
          '如果思绪过于活跃，可以尝试"清空大脑"法——把明天要做的事写在纸上，让大脑知道这些事已经被记录，可以安心休息。'
        ]
      }
    ]
  },
  {
    id: 3,
    icon: '🧘',
    title: '正念冥想入门',
    tags: ['冥想', '正念', '减压'],
    tips: [
      '从每天 5 分钟开始，慢慢增加到 15-20 分钟',
      '不要追求"什么都不想"，而是学会观察思绪而不评判',
      '使用冥想 App 或引导音频可以帮助入门',
      '将正念融入日常生活——正念吃饭、正念走路、正念刷牙'
    ],
    sections: [
      {
        heading: '什么是正念冥想',
        paragraphs: [
          '正念（Mindfulness）是一种有意识地、不加评判地关注当下的觉知状态。它源于古老的佛教禅修传统，但经过现代心理学的研究和改进，已成为广泛使用的减压与心理成长工具。',
          '冥想并不神秘，也不是宗教活动。它就是大脑的"健身训练"——通过规律练习，增强专注力、情绪调节能力和自我觉察。'
        ]
      },
      {
        heading: '科学研究支持',
        paragraphs: [
          '哈佛大学的研究发现，8 周的正念冥想训练可以显著改变大脑结构：海马体（负责学习和记忆）灰质密度增加，杏仁核（负责恐惧和压力反应）体积减小。',
          '正念冥想被证实可以降低皮质醇（压力激素）水平、改善免疫功能、减轻焦虑和抑郁症状，甚至帮助慢性疼痛患者更好地应对疼痛。'
        ]
      },
      {
        heading: '简单入门练习',
        paragraphs: [
          '坐在舒适的位置，闭上双眼。将注意力集中在呼吸上，感受空气进入鼻腔、胸腔起伏。当思绪游走时（这是正常的），只需轻轻把注意力带回呼吸。每次 5-10 分钟即可感受到明显的身心放松。',
          '身体扫描也是很好的入门方法：从头到脚，逐一关注身体的每个部位，感受各处的温度和触感，不改变任何感受，只是觉察。'
        ]
      }
    ]
  },
  {
    id: 4,
    icon: '💪',
    title: '建立心理韧性',
    tags: ['心理韧性', '成长', '抗压能力'],
    tips: [
      '把挫折视为成长的机会，而非失败的证明',
      '培养至少一项能让你全身心投入的兴趣爱好',
      '建立并维系 3-5 个高质量的社交关系',
      '练习自我关怀——像对待最好的朋友那样对待自己'
    ],
    sections: [
      {
        heading: '什么是心理韧性',
        paragraphs: [
          '心理韧性（Resilience）是指个体在面对逆境、创伤、压力或重大变故时，能够有效应对并从中恢复的能力。它不是与生俱来的天赋，而是可以通过后天练习培养的技能。',
          '具有高心理韧性的人并非感受不到痛苦，而是他们能够更快地从打击中恢复，并从困境中汲取经验和力量。就像一根有弹性的竹子，在暴风雨中会弯曲但不会折断。'
        ]
      },
      {
        heading: '培养心理韧性的方法',
        paragraphs: [
          '首先，建立稳定的支持系统。与家人、朋友或社群保持联系。在困难时勇于寻求帮助是韧性的体现，而非软弱的标志。',
          '其次，培养乐观但现实的心态。乐观不是忽视问题，而是相信自己有能力应对。练习"最坏情况分析"——问问自己最坏会怎样，往往发现其实也没那么可怕。',
          '第三，照顾好自己的身体。规律运动、健康饮食、充足睡眠是心理韧性的生理基础。身体和心灵是密不可分的整体。'
        ]
      },
      {
        heading: '日常韧性训练',
        paragraphs: [
          '每天花几分钟写下三件值得感恩的事，这能训练大脑关注积极面。研究证实，持续 21 天的感恩练习就能显著提升幸福感。',
          '学会接纳不确定性。生活中的很多焦虑来自对确定性的过度追求。练习"放下控制"——有些事情我们无法改变，但我们可以选择如何回应。'
        ]
      }
    ]
  },
  {
    id: 5,
    icon: '❤️',
    title: '情绪管理基础',
    tags: ['情绪', '自我认知', '人际交往'],
    tips: [
      '给情绪命名——研究表明，准确说出自己的感受本身就有疗愈作用',
      '区分"事实"和"想法"——很多时候困扰我们的是对事情的解读',
      '使用"我感到...，因为...，我需要..."句式表达情绪需求',
      '情绪没有好坏之分，重要的是如何表达和调节'
    ],
    sections: [
      {
        heading: '认识你的情绪',
        paragraphs: [
          '情绪是人类进化出的精妙信号系统。每种情绪都在告诉我们重要信息：恐惧提示危险，愤怒表明边界被侵犯，悲伤帮助我们释放和获得支持，快乐则是"一切顺利"的信号。',
          '压抑情绪并不可取。被压抑的情绪并不会消失，而是会在意想不到的时刻以更强烈的方式爆发。健康的情绪管理是"觉察-接纳-表达"的过程。'
        ]
      },
      {
        heading: '情绪调节策略',
        paragraphs: [
          '当你感到强烈情绪时，先暂停（STOP）：停止当前行为、深呼吸几次、观察自己的感受和身体反应、然后再决定如何行动。',
          '运动是快速改变情绪状态的有效方法。即使是 10 分钟的快走，也能显著改善情绪。写作也是强大的情绪调节工具——把感受写下来能帮助大脑处理情绪信息。',
          '培养"情绪词汇表"。很多人只能说出"好"或"不好"，但情绪光谱非常丰富。尝试区分"失望"和"沮丧"、"满足"和"喜悦"之间的微妙差别，这种精确性能提升情绪管理能力。'
        ]
      }
    ]
  },
  {
    id: 6,
    icon: '🤝',
    title: '健康的人际关系',
    tags: ['人际关系', '沟通', '边界'],
    tips: [
      '学会说"不"——设立健康的边界是自我保护的必要手段',
      '练习主动倾听：听对方说完，不打断，用自己的话复述确认',
      '定期与重要的人进行高质量的"一对一"相处时间',
      '冲突是关系的正常部分，关键是处理方式而非避免冲突'
    ],
    sections: [
      {
        heading: '人际关系与心理健康',
        paragraphs: [
          '哈佛大学持续 80 年的研究表明，决定人类幸福的最重要因素是良好的人际关系，而非财富、名声或成就。与他人的深度连接能满足我们最基本的归属需要。',
          '孤独感的危害不亚于每天吸 15 支烟。良好的社交关系可以缓冲压力、提升免疫力、甚至延长寿命。'
        ]
      },
      {
        heading: '建立健康关系的原则',
        paragraphs: [
          '真诚是第一原则。真实地表达自己的感受和需要，也尊重对方的真实。戴着面具建立的关系终究无法持久。',
          '学会适度依赖。既不孤立自己，也不过度依赖他人。健康的关系是"有你就更好，没有我也能过"。',
          '设立边界不是冷漠。明确告诉对方什么是你可以接受的，什么是不可接受的。清晰的边界反而让关系更安全、更持久。'
        ]
      },
      {
        heading: '化解关系冲突',
        paragraphs: [
          '使用"我陈述句"而非"你陈述句"。说"我感到被忽视"比"你总是不理我"更容易被对方接受。',
          '冲突中先关注情绪，再处理问题。当双方情绪激动时，暂停 20 分钟让身体冷静下来再继续对话。这段时间可以做个深呼吸或散个步。'
        ]
      }
    ]
  }
]

const currentArticle = computed(() => {
  return knowledgeList.find(item => String(item.id) === activeIndex.value) || knowledgeList[0]
})

const handleMenuSelect = (index) => {
  activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.knowledge-page {
  min-height: calc(100vh - 200px);
  background: linear-gradient(180deg, #f0f7f5 0%, #fafcfb 40%, #fff 100%);

  .knowledge-hero {
    text-align: center;
    padding: 50px 20px 40px;
    .hero-content {
      h1 { font-size: 36px; color: #2c3e50; margin-bottom: 10px; }
      p { font-size: 16px; color: #7f8c8d; }
    }
  }

  .knowledge-body {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 30px;
    padding: 0 20px 60px;
    align-items: flex-start;
  }

  .knowledge-sidebar {
    width: 240px;
    flex-shrink: 0;
    position: sticky;
    top: 20px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(74, 156, 140, 0.08);
  }

  .knowledge-main {
    flex: 1;
    min-height: 600px;
  }
}

.article-reader {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(74, 156, 140, 0.06);

  .reader-title {
    font-size: 28px;
    color: #2c3e50;
    margin-bottom: 16px;
  }

  .reader-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .reader-section {
    margin-bottom: 30px;

    h3 {
      font-size: 18px;
      color: #4A9C8C;
      margin-bottom: 12px;
      padding-left: 12px;
      border-left: 3px solid #4A9C8C;
    }

    p {
      font-size: 15px;
      color: #4a5568;
      line-height: 1.9;
      margin-bottom: 12px;
      text-indent: 2em;
    }
  }

  .reader-tips {
    background: linear-gradient(135deg, #f0f7f5 0%, #fafcfb 100%);
    border-radius: 14px;
    padding: 24px;
    margin-top: 40px;
    border: 1px solid rgba(74, 156, 140, 0.15);

    .tips-header {
      font-size: 17px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 16px;
    }

    ul {
      padding-left: 0;
      list-style: none;

      li {
        position: relative;
        padding-left: 28px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #4a5568;
        line-height: 1.7;

        &::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4A9C8C;
          font-weight: bold;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .knowledge-body {
    flex-direction: column;
  }
  .knowledge-sidebar {
    width: 100%;
    position: static;
  }
}
</style>
