import type { AxiosInstance } from 'axios'
import axios from 'axios'

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
// api.interceptors.request.use(
//   (config: AxiosRequestConfig): AxiosRequestConfig => {
//     try {
//       const token = localStorage.getItem('bbta_token')
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     } catch (_e) {
//       // ignore localStorage errors
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// // response interceptor — normalize and handle 401
// api.interceptors.response.use(
//   (res: AxiosResponse) => res,
//   (err: AxiosError) => {
//     const status = err.response?.status

//     if (status === 401) {
//       // best-effort cleanup (do not force navigation)
//       try {
//         localStorage.removeItem('bbta_token')
//       } catch (_e) {
//         // noop
//       }
//     }

//     const normalized = {
//       status: status ?? 0,
//       message: err.message,
//       data: err.response?.data ?? null,
//       originalError: err,
//     }

//     return Promise.reject(normalized)
//   },
// )
