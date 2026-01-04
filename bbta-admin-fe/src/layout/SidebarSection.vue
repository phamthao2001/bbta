<template>
  <div class="flex h-full">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r flex flex-col transition-all duration-200 ease-in-out',
        collapsed ? 'w-20' : 'w-64',
      ]"
    >
      <!-- Navigation -->
      <nav class="flex-1 overflow-auto px-2 py-3">
        <RouterLink
          v-for="item in nav"
          :key="item.name"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
          active-class="bg-gray-100 font-semibold"
        >
          <span
            class="w-6 h-6 text-gray-500 flex items-center justify-center"
            v-html="item.icon"
          ></span>
          <span v-if="!collapsed" class="truncate">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Footer / profile -->
      <div class="p-3 border-t">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div v-if="!collapsed">
            <div class="text-sm font-medium">Admin</div>
            <div class="text-xs text-gray-500">admin@example.com</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content slot -->
    <div class="flex-1 overflow-auto bg-gray-50">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const collapsed = ref(false)

const nav = [
  {
    name: 'Trang chủ',
    to: '/dashboard',
    icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M13 5v6h6' /></svg>`,
  },
  {
    name: 'Bàn ăn',
    to: '/tables',
    icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 7h18M3 12h18M3 17h18' /></svg>`,
  },
  {
    name: 'Thực đơn',
    to: '/menu',
    icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h16' /></svg>`,
  },
  {
    name: 'Admin',
    to: '/admin',
    icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' /></svg>`,
  },
  {
    name: 'Nhân viên',
    to: '/staff',
    icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M12 7a4 4 0 110 8 4 4 0 010-8z' /></svg>`,
  },
  {
    name: 'Khách hàng',
    to: '/customers',
    icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M12 7a4 4 0 110 8 4 4 0 010-8z' /></svg>`,
  },
]

// expose RouterLink so template resolves it (Script setup auto-registers, but explicit import helps TS)
</script>

<style scoped lang="scss">
.box-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06);
}

aside::-webkit-scrollbar {
  width: 8px;
}
aside::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
</style>
