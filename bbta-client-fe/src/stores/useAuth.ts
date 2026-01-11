import { ref } from 'vue'

const customerId = ref(null)
const isLoginedIn = ref(false)

export const useAuth = () => {
  return {
    isLoginedIn,
    customerId,
  }
}
