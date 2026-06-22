<template>
 <div class="container">
  <div class="title">
    <div class="back-home" @click="$router.push('/')">
      <el-icon><Back/></el-icon>
      <span>返回首页</span>
    </div>
    <div class="title-text">
      <h2>登录您的账户</h2>
      <p>请输入您的登录信息</p>
    </div>
  </div>
  <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleLogin(ruleFormRef)">登 录 账 户</el-button>
        </el-form-item>
      </el-form>
      <div class="extra-links">
        <span>还没有账户？<router-link to="/auth/register">立即注册</router-link></span>
      </div>
  </div>
 </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Back } from '@element-plus/icons-vue'
import {login} from '../api/admin'
import {useRouter} from 'vue-router'

const ruleFormRef = ref(null)
const router=useRouter()

const formData = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
       login(formData).then(data=>{
         if(!data.token){
          return console.log('登录失败');
         }
         localStorage.setItem('token',data.token)
         localStorage.setItem('userInfo',JSON.stringify(data.userInfo))
         if(data.userInfo.userType===2){
           router.push('/back/dashboard')
         }else{
          router.push('/')
         }
       })
    }
  })
}
</script>

<style lang="scss" scoped>
.container{
  width:384px;
  .title{
    .back-home{
      margin-bottom: 60px;
      display: flex;
      align-items: center;
      gap: 4px;
      color: #6b7280;
      cursor: pointer;
      font-size: 14px;
      &:hover {
        color: #409eff;
      }
    }
    .title-text{
      text-align: center;
      h2{
        font-size:36px;
        margin-bottom: 10px;
      }
      p{
        font-size:18px;
        color:#6b7280;
      }
    }
  }
  .form-container{
    margin-top: 40px;
    .submit-btn{
      width: 100%;
    }
    .extra-links{
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #6b7280;
      a{
        color: #409eff;
        text-decoration: none;
      }
    }
  }
}

</style>
