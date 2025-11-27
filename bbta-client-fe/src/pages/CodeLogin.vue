<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/plugin/axios'
import router from '@/router'

const route = useRoute()

const code_login = route.query.code_login as string

const verifyCode = async () => {
  try {
    const res = await api.post('/auth/code-login', {
      code_login,
    })

    const { _id } = res.data

    localStorage.setItem('serve-session-id', _id)
    localStorage.setItem('code_login', code_login)

    router.push('/home')
  } catch (error) {
    router.push('/welcome')
  }
}

onMounted(async () => {
  if (code_login) {
    await verifyCode()
  }
})
</script>

<style lang="scss"></style>
