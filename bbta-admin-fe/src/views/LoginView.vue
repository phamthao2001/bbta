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
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="admin"
          />
        </div>

        <div class="space-y-1.5">
          <label for="password" class="block text-sm font-medium text-slate-700"> Mật khẩu </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="••••••••"
          />
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

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const submitting = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  errorMessage.value = ''
  submitting.value = true

  try {
    // TODO: Replace this with real API call / auth logic
    // Example:
    // await axios.post('/api/admin/login', form)

    // Fake delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Redirect to a default admin page (update path if needed)
    router.push({ name: 'tables' })
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
