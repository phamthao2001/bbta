import type { AxiosInstance } from 'axios'
import axios from 'axios'

import router from '@/router'

const baseURL = 'http://localhost:3000/api'

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// request interceptor — attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bbta_admin_token')
    if (token && config.headers) {
      config.headers.authorization = `${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// response interceptor — normalize and handle 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status

    if (status === 401) {
      localStorage.removeItem('bbta_admin_token')
      await router.push('/login')
    }

    const normalized = {
      status: status ?? 0,
      message: err.message,
      data: err.response?.data ?? null,
      originalError: err,
    }

    return Promise.reject(normalized)
  },
)
