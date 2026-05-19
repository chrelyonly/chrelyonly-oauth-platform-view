<script setup>
import {computed, ref} from 'vue'
import {ElMessage} from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },

  /**
   * 应用信息
   */
  appInfo: {
    type: Object,
    default: () => ({
      appName: '未知应用',
      appLogo: '🍓',
      appDesc: '申请获取你的账号信息'
    })
  },


  /**
   * 权限
   */
  scopes: {
    type: Array,
    default: () => []
  },

  /**
   * loading
   */
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'confirm',
  'cancel'
])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

/**
 * 同意授权
 */
const handleConfirm = () => {
  emit('confirm')
}

/**
 * 拒绝授权
 */
const handleCancel = () => {
  visible.value = false
  emit('cancel')

  ElMessage.warning('已取消授权')
}
</script>

<template>

  <el-dialog
      v-model="visible"
      width="520px"
      align-center
      :show-close="false"
      :close-on-click-modal="false"
      class="oauth-dialog"
  >

    <div class="oauth-content">

      <!-- logo -->
      <div class="oauth-logo">
        <el-avatar
            :src="appInfo.appLogo"
            :size="100"
        />
      </div>

      <!-- 标题 -->
      <div class="oauth-title">
        {{ appInfo.appName }}
      </div>

      <div class="oauth-desc">
        {{ appInfo.appDesc }}
      </div>

      <!-- 权限 -->
      <div class="scope-list">
        <div
            class="scope-item"
            v-for="(item,index) in scopes"
            :key="index"
        >
          <div class="scope-check">
            ✓
          </div>

          <span>
            {{ item }}
          </span>
        </div>

      </div>

      <!-- 提示 -->
      <div class="oauth-tip">
        请确认该应用可信后再授权
      </div>

      <!-- 按钮 -->
      <div class="oauth-actions">

        <el-button
            size="large"
            class="cancel-btn"
            @click="handleCancel"
        >
          拒绝
        </el-button>

        <el-button
            type="primary"
            size="large"
            class="confirm-btn"
            :loading="loading"
            @click="handleConfirm"
        >
          同意授权
        </el-button>

      </div>

    </div>

  </el-dialog>

</template>

<style scoped>

/* dialog */

:deep(.oauth-dialog) {
  border-radius: 28px;
  overflow: hidden;
}

:deep(.oauth-dialog .el-dialog__body) {
  padding: 28px;
}

/* 内容 */

.oauth-content {
  display: flex;
  flex-direction: column;
}

/* logo */

.oauth-logo {

  border-radius: 26px;

  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 40px;
  color: white;

}

/* 标题 */

.oauth-title {
  text-align: center;

  font-size: 28px;
  font-weight: 700;

  color: #303133;

  margin-bottom: 10px;
}

.oauth-desc {
  text-align: center;

  color: #909399;

  margin-bottom: 34px;

  font-size: 14px;
}

/* 用户 */

.oauth-user {
  display: flex;
  align-items: center;

  padding: 18px;

  border-radius: 18px;

  background: #fafafa;

  margin-bottom: 24px;
}

.oauth-user-info {
  margin-left: 16px;
}

.nickname {
  font-size: 16px;
  font-weight: 600;

  color: #303133;
}

.status {
  margin-top: 4px;

  color: #909399;

  font-size: 13px;
}

/* 权限 */

.scope-list {
  display: flex;
  flex-direction: column;

  gap: 14px;

  margin-bottom: 24px;
}

.scope-item {
  display: flex;
  align-items: center;

  padding: 16px 18px;

  border-radius: 14px;

  background: #fafafa;

  transition: all .25s ease;
}

.scope-item:hover {
  transform: translateX(4px);
}

.scope-check {
  width: 22px;
  height: 22px;

  border-radius: 50%;

  margin-right: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #ff5c8d;

  color: white;

  font-size: 12px;
}

/* 提示 */

.oauth-tip {
  padding: 14px 18px;

  border-radius: 14px;

  background: #fff7e6;

  color: #d48806;

  font-size: 14px;

  margin-bottom: 28px;
}

/* 按钮 */

.oauth-actions {
  display: flex;
  gap: 14px;
}

.cancel-btn {
  flex: 1;

  height: 50px;

  border-radius: 14px;
}

.confirm-btn {
  flex: 2;

  height: 50px;

  border: none;

  border-radius: 14px;

  font-size: 15px;
  font-weight: 600;

  background:
      linear-gradient(
          135deg,
          #ff7eb3 0%,
          #ff5c8d 100%
      );

  box-shadow:
      0 10px 24px rgba(255, 105, 180, 0.22);
}

.confirm-btn:hover {
  transform: translateY(-2px);
}

</style>