<script setup>
import {onMounted, ref} from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  Key
} from '@element-plus/icons-vue'
import router from "@/router/index.js";
import AuthorizeConfirm from "@/components/authorizeConfirm.vue/authorizeConfirm.vue";

const loading = ref(false)

const loginForm = ref({
  userAccount: '',
  password: '',
  clientId: '',
  code: '',
  remember: true
})

// 验证码信息
const captchaInfo = ref({
  key: "",
  image: "",
})
// 获取验证码
const getCode = ()=>{
  let params = {

  }
  $https("/open-api/oauth2/getCode","get",params,1,{}).then(res => {
    captchaInfo.value.image = res.data.data.image
    captchaInfo.value.key = res.data.data.key
  })
}


// 授权code
const oauthKey = ref("");
// 登录
const handleLogin = async () => {
  if (!loginForm.value.userAccount) {
    ElMessage.warning('请输入账号')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (!loginForm.value.code) {
    ElMessage.warning('请输入验证码')
    return
  }
  if (!loginForm.value.clientId) {
    ElMessage.warning('请输入客户端id')
    return
  }

  loading.value = true
  let params = {
    ...loginForm.value
  }

  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": loginForm.value.code,
  }
  $https("/open-api/oauth2/oauth2Authorize","post",params,2,headers).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('登录成功')
      visible.value = true
      oauthKey.value = res.data.data.oauthKey
      appInfo.value = res.data.data.openAppid
      $setStore({
        name: "userInfo",
        content: res.data.data
      })
    }else{
      ElMessage.error(res.data.msg)
    }
  }).finally(() => {
    getCode()
    loading.value = false
  })
}




// 授权弹窗
const visible = ref(false)
const appInfo = ref(null)


const scopes = [
  '获取你的昵称',
  '获取你的头像',
  '读取你的基础资料'
]

const handleConfirm = () => {
  console.log('确认授权')

  window.location.href = redirectUri.value + "?oauthKey=" + oauthKey.value
}

const handleCancel = () => {
  console.log('取消授权')
}

// 用户登录状态
const userInfo = ref(null)
// 获取用户登录状态
const getUserLogin = () => {
  userInfo.value = $getStore({
    name: "userInfo",
  });
  if (userInfo.value) {
    oauthKey.value = userInfo.value.oauthKey
    appInfo.value = userInfo.value.openAppid
    visible.value = true
  }
}

const redirectUri = ref("")
onMounted(()=>{
  getCode()
  getUserLogin()
  // 获取参数
  const params = new URLSearchParams(window.location.search)
  loginForm.value.clientId = params.get('type')
  redirectUri.value = params.get('redirectUri')

//   判断是否存在旧的授权信息，如果存在就直接登陆了
})
</script>

<template>
  <div class="login-page">

    <!-- 背景模糊圆 -->
    <div class="blur blur1"></div>
    <div class="blur blur2"></div>

    <div class="login-container">

      <!-- 左侧 -->
      <div class="left-content">
        <div class="logo-box">
          🍓
        </div>

        <h1>莓莓用户授权中心</h1>

        <p>
          统一管理用户信息
        </p>

        <div class="tips">
          OAuth 2.0 Authorization Service
        </div>
      </div>

      <!-- 右侧登录 -->
      <div class="login-card">

        <div class="card-title">
          欢迎登录
        </div>

        <div class="card-desc">
          使用您的账号继续授权
        </div>

        <el-form
            :model="loginForm"
            @keyup.enter="handleLogin"
        >

          <el-form-item>
            <el-input
                v-model="loginForm.userAccount"
                placeholder="账号"
                size="large"
                clearable
            >
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                size="large"
                show-password
                clearable
            >
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="loginForm.code" maxlength="6" placeholder="请输入验证码" prefix-icon="el-icon-sunny" >
              <template #append>
                <el-image :src="captchaInfo.image" @click="getCode" style="height: 100%"></el-image>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
                v-model="loginForm.clientId"
                placeholder="Client ID"
                disabled
                size="large"
                clearable
            >
              <template #prefix>
                <el-icon>
                  <Key />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="login-options">
            <el-checkbox v-model="loginForm.remember">
              记住登录
            </el-checkbox>

            <span class="forget-text">
              忘记密码
            </span>
          </div>

          <el-button
              type="primary"
              class="login-btn"
              size="large"
              :loading="loading"
              @click="handleLogin"
          >
            登录授权
          </el-button>

        </el-form>

      </div>
    </div>
  </div>
  <authorizeConfirm
      v-model="visible"
      :loading="loading"
      :appInfo="appInfo"
      :scopes="scopes"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  />
</template>

<style scoped>

.login-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  background:
      linear-gradient(
          135deg,
          #fff7fb 0%,
          #fff 45%,
          #fff5f7 100%
      );
}

/* 模糊背景 */
.blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.45;
}

.blur1 {
  width: 320px;
  height: 320px;
  background: #ff9ecf;
  top: -60px;
  left: -80px;
}

.blur2 {
  width: 260px;
  height: 260px;
  background: #ffc8dd;
  bottom: -80px;
  right: -50px;
}

.login-container {
  width: 980px;
  height: 620px;

  background: rgba(255,255,255,0.75);

  backdrop-filter: blur(20px);

  border: 1px solid rgba(255,255,255,0.7);

  border-radius: 32px;

  box-shadow:
      0 10px 40px rgba(255, 182, 193, 0.15);

  display: flex;

  overflow: hidden;

  z-index: 2;
}

/* 左边 */
.left-content {
  width: 48%;
  background:
      linear-gradient(
          180deg,
          #ffeff6 0%,
          #fff7fa 100%
      );

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 60px;
}

.logo-box {
  width: 78px;
  height: 78px;

  border-radius: 24px;

  background: white;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 36px;

  box-shadow:
      0 10px 25px rgba(255, 105, 180, 0.12);

  margin-bottom: 28px;
}

.left-content h1 {
  margin: 0;

  font-size: 42px;
  font-weight: 700;

  color: #303133;

  line-height: 1.3;
}

.left-content p {
  margin-top: 18px;

  color: #909399;

  font-size: 16px;

  letter-spacing: 1px;
}

.tips {
  margin-top: 40px;

  display: inline-flex;

  width: fit-content;

  padding: 10px 18px;

  border-radius: 999px;

  background: rgba(255,255,255,0.7);

  color: #d63384;

  font-size: 14px;
}

/* 登录卡片 */
.login-card {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 70px;
}

.card-title {
  font-size: 30px;
  font-weight: 700;

  color: #303133;

  margin-bottom: 10px;
}

.card-desc {
  color: #909399;

  margin-bottom: 35px;

  font-size: 14px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-input__wrapper) {
  height: 52px;

  border-radius: 16px;

  background: #fafafa;

  box-shadow: none !important;

  border: 1px solid #f0f0f0;

  transition: all 0.25s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #ff9ecf;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #ff6ba6;
  background: white;
}
:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input__inner) {
  font-size: 15px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 28px;

  font-size: 14px;
}

.forget-text {
  color: #ff6ba6;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  height: 52px;

  border: none;

  border-radius: 16px;

  font-size: 16px;
  font-weight: 600;

  background:
      linear-gradient(
          135deg,
          #ff7eb3 0%,
          #ff5c8d 100%
      );

  box-shadow:
      0 12px 24px rgba(255, 105, 180, 0.22);

  transition: all 0.25s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
}

/* 响应式 */
@media screen and (max-width: 900px) {

  .login-container {
    width: 92%;
    height: auto;

    flex-direction: column;
  }

  .left-content {
    width: 100%;
    padding: 45px;
  }

  .login-card {
    padding: 45px;
  }

  .left-content h1 {
    font-size: 32px;
  }
}
</style>