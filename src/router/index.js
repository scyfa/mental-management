import { createRouter, createWebHistory } from 'vue-router'

const routes = [
{
    path: '/back',
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

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
