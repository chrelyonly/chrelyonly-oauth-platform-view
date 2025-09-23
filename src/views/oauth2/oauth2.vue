<template>
  <div class="oauth-container">
    <h1>OAuth2 授权登录</h1>
    <p>请点击下方按钮进行第三方登录：</p>
    <button @click="redirectToAuth">使用 OAuth2 登录</button>

    <div v-if="authCode" class="result">
      <p>授权码: <b>{{ authCode }}</b></p>
      <button @click="exchangeToken">获取 Access Token</button>
    </div>

    <div v-if="accessToken" class="result">
      <p>Access Token: <b>{{ accessToken }}</b></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// OAuth2 配置（这里需要换成你实际的配置）
const clientId = "your-client-id"
const clientSecret = "your-client-secret" // 一般不会放前端，演示用
const redirectUri = "http://localhost:5173/oauth/callback"
const authUrl = "https://oauth.example.com/authorize"
const tokenUrl = "https://oauth.example.com/token"

const authCode = ref(null)
const accessToken = ref(null)

onMounted(() => {
  // 授权服务器回调时会带 code
  const code = route.query.code
  if (code) {
    authCode.value = code
  }
})

/** 跳转到授权服务器 */
function redirectToAuth() {
  const url = `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
  )}&scope=read`
  window.location.href = url
}

/** 用授权码换取 Access Token */
async function exchangeToken() {
  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode.value,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret, // ⚠️ 实际项目中不要放前端
      }),
    })

    const data = await res.json()
    if (data.access_token) {
      accessToken.value = data.access_token
    } else {
      alert("获取 token 失败：" + JSON.stringify(data))
    }
  } catch (e) {
    alert("请求出错：" + e.message)
  }
}
</script>

<style scoped>
.oauth-container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.result {
  margin-top: 20px;
  text-align: left;
  word-break: break-all;
}
</style>
