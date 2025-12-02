<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10 border border-slate-200">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-slate-900">BBTA Admin</h1>
        <p class="mt-1 text-sm text-slate-500">Đăng nhập để quản lý hệ thống</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div class="space-y-1.5">
          <label for="email" class="block text-sm font-medium text-slate-700">
            Tên đăng nhập
          </label>
          <el-input v-model="form.username"></el-input>
        </div>

        <div class="space-y-1.5">
          <label for="password" class="block text-sm font-medium text-slate-700"> Mật khẩu </label>
          <el-input v-model="form.password" show-password></el-input>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
        >
          <span v-if="!submitting">Sign in</span>
          <span v-else>Signing in...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { api } from '@/plugin/axios'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const submitting = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  errorMessage.value = ''
  submitting.value = true

  try {
    const res = await api.post('/admin/login', {
      ...form,
    })

    const token = res.data.token

    localStorage.setItem('bbta_staff_token', token)

    router.push({ name: 'home' })
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
body {
  margin: 0;
}
</style>
