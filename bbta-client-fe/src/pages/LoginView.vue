<template>
  <div
    class="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4"
  >
    <div
      class="w-full max-w-sm card-bg rounded-2xl shadow-2xl px-6 py-6 ring-1 ring-black/6 border-transparent/10"
    >
      <!-- logo + title -->
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 rounded-lg bg-linear-to-br from-green-500 to-emerald-400 text-white mx-auto flex items-center justify-center font-extrabold text-xl"
        >
          BBTA
        </div>
        <h1 class="mt-3 text-2xl font-extrabold">Chào mừng</h1>
        <p class="text-sm text-gray-500 mt-1">Đăng nhập để đặt món và thanh toán nhanh chóng</p>
      </div>

      <!-- form -->
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
          <div class="flex items-center gap-2">
            <div class="px-3 py-2 bg-gray-100 text-sm rounded-lg">+84</div>
            <input
              v-model="phone"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Nhập số điện thoại"
              class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
          <p v-if="phoneError" class="text-xs text-red-500 mt-1">{{ phoneError }}</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Mật khẩu</label>
          <div class="relative mb-2">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Nhập mật khẩu"
              class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
          <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="remember" class="w-4 h-4 rounded-sm" />
            <span>Ghi nhớ</span>
          </label>
          <button type="button" class="text-green-600 font-medium" @click="forgotPassword">
            Quên mật khẩu?
          </button>
        </div>

        <div>
          <button
            :disabled="!valid || loading"
            class="w-full py-3 rounded-xl text-white font-semibold bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span
              v-if="loading"
              class="loader border-white w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            ></span>
            Đăng nhập
          </button>
        </div>

        <div class="text-center text-xs text-gray-400 mt-3 mb-6">Hoặc</div>

        <div class="grid grid-cols-1 gap-2">
          <button
            type="button"
            @click="goToRegister"
            class="w-full py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold"
          >
            Tạo tài khoản mới
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { api } from '@/plugin/axios'

const router = useRouter()

const phone = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const phoneError = computed(() => {
  if (!phone.value) return null
  const digits = phone.value.replace(/[^0-9]/g, '')
  if (digits.length < 6) return 'Số điện thoại không hợp lệ'
  return null
})

const passwordError = computed(() => {
  if (!password.value) return null
  if (password.value.length < 4) return 'Mật khẩu quá ngắn'
  return null
})

const valid = computed(
  () => !!phone.value && !!password.value && !phoneError.value && !passwordError.value,
)

async function submit() {
  if (!valid.value) return
  loading.value = true
  error.value = null

  try {
    // call the API login endpoint — adjust path to match your backend
    const res = await api.post('/auth/login', { phone: phone.value, password: password.value })
    const token = res?.data?.token
    if (token) {
      try {
        localStorage.setItem('bbta_token', token)
      } catch {
        // ignore storage errors
      }
      router.push({ name: 'Home' }).catch(() => null)
    } else {
      error.value = res?.data?.message ?? 'Đăng nhập không thành công'
    }
  } catch (err: unknown) {
    const maybe = err as Record<string, unknown> | null
    const msg = maybe && typeof maybe.message === 'string' ? maybe.message : null
    error.value = msg ?? 'Có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

// otp login removed from UI — function intentionally omitted

function goToRegister() {
  router.push({ name: 'Register' }).catch(() => alert('Đăng ký chưa cấu hình'))
}

function forgotPassword() {
  alert('Flow quên mật khẩu chưa triển khai')
}
</script>

<style scoped>
.loader {
  border-width: 2px;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

/* card background tuned for project (warm / amber) */
.card-bg {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 247, 236, 0.95));
  border-color: rgba(255, 234, 179, 0.6);
}
</style>
