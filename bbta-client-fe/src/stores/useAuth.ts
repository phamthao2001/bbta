import { ref } from 'vue'

const isLoginedIn = ref(false)

export const useAuth = () => {
  return {
    isLoginedIn,
  }
}
