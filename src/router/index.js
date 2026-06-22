import { createRouter, createWebHistory } from 'vue-router'

const routes = [
{
    path: '/back',
    redirect:'/back/dashboard',
    name: 'BackendLayout',
    component: () => import('../views/BackendLayout.vue'),
      children:[
      {
         path: 'dashboard',
         component:()=>import('../views/dashboard.vue'),
         meta:{
            title:'数据分析',
            icon:'PieChart'
         }
      },
      {
        path:'knowledge',
        component:()=>import('../views/knowledge.vue'),
        meta:{
          title:'知识文章',
          icon:'Document'
        }
      },
      {
        path:'consulations',
        component:()=>import('../views/consulations.vue'),
        meta:{
          title:'咨询记录',
          icon:'ChatLineSquare'
        }
      },
      {
        path:'emotional',
        component:()=>import('../views/emotional.vue'),
        meta:{
          title:'情绪日志',
          icon:'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    name: 'AuthLayout',
    component: () => import('../views/AuthLayout.vue'),
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]

const frontendRoutes = [
  {
    path: '/',
    component: () => import('../components/FrontendLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'FrontHome',
        component: () => import('../views/frontend/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'consulation',
        name: 'FrontConsulation',
        component: () => import('../views/frontend/AIConsulation.vue'),
        meta: { title: 'AI咨询' }
      },
      {
        path: 'emotion-diary',
        name: 'FrontEmotionDiary',
        component: () => import('../views/frontend/EmotionDiary.vue'),
        meta: { title: '情绪日记' }
      },
      {
        path: 'knowledge',
        name: 'FrontKnowledge',
        component: () => import('../views/frontend/KnowledgeBase.vue'),
        meta: { title: '知识库' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [ ...routes,...frontendRoutes],
})

router.beforeEach((to,from,next)=>{
  const token=localStorage.getItem('token')
  if(token){
    const userInfo= JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo&&userInfo.userType==2)
    {
        if(to.path.startsWith('/back')){
          next()
        }else{
          next('/back/dashboard')
        }
    }
    else if(userInfo.userType==1){
      if(to.path.startsWith('/back')||to.path.startsWith('/auth')){
          next('/')
      }else{
        next()
      }
    }
  }else{
    if(to.path.startsWith('/back')){
      next('/auth/login')
    }else{
      next()
    }
  }
})

export default router
