<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-orange-50 text-gray-800 flex flex-col items-stretch"
  >
    <!-- Top header -->
    <header
      class="px-4 py-3 flex items-center justify-between sticky top-0 z-30 bg-white/70 backdrop-blur-md shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 text-white flex items-center justify-center font-bold"
        >
          BB
        </div>
        <div>
          <div class="text-xs text-gray-500">Quán Nướng & Lẩu</div>
          <div class="text-sm font-semibold">BBTA</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!isLoginedIn"
          @click="router.push('/login')"
          class="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 shadow-sm"
        >
          Đăng nhập
        </button>
        <button
          v-else
          class="p-2 w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm"
        >
          <i class="fa-solid fa-user"></i>
        </button>
      </div>
    </header>

    <!-- Center hero / landing -->
    <main class="px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
      <img
        src="@/assets/img/avt_1.jpg"
        alt="bbq"
        class="w-44 h-44 rounded-xl object-cover shadow-2xl mb-6"
      />

      <h1 class="text-xl md:text-2xl font-extrabold leading-tight mb-2">Quán Nướng & Lẩu BBTA</h1>
      <p class="text-sm text-gray-600 max-w-[42ch] mb-6">
        Hương vị than hoa, nồi lẩu nghi ngút — đặt món dễ dàng, thanh toán nhanh chóng.
      </p>

      <div class="space-y-3 w-full max-w-sm">
        <button
          @click="orderNow"
          class="w-full py-3 rounded-xl bg-green-600 text-white text-lg font-semibold shadow-lg hover:bg-green-700 transition"
        >
          Đặt món
        </button>
        <button
          @click="payNow"
          class="w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-lg font-semibold shadow-sm hover:shadow-md transition"
        >
          Đơn của bạn
        </button>
      </div>

      <div class="mt-8 text-xs text-gray-500">Giờ mở cửa 16h00 - 23h00</div>
    </main>

    <!-- Footer small legal / brand -->
    <footer
      class="px-4 py-4 text-center text-xs text-gray-500 border-t border-transparent/20 bg-white/60"
    >
      © 2025 BBTA — Quán Nướng & Lẩu. Tải ứng dụng để đặt nhanh hơn.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useAuth } from '../stores/useAuth'

const router = useRouter()

const { isLoginedIn } = useAuth()

function orderNow(): void {
  router.push('/order-food')
}

function payNow(): void {
  router.push('/my-order')
}
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(180deg, rgba(255, 240, 219, 0.9), rgba(255, 247, 237, 0.6));
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}
</style>
