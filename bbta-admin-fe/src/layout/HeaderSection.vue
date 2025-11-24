<template>
  <header class="h-16 bg-white border-b flex items-center justify-between px-4">
    <!-- Left: optional back / title / toggle -->
    <div class="flex items-center gap-4">
      <button
        @click="emitToggle()"
        class="p-2 rounded hover:bg-gray-100 text-gray-600 md:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div class="hidden md:flex items-center gap-3">
        <div class="text-lg font-semibold">Admin</div>
        <div class="text-sm text-gray-500">Dashboard</div>
      </div>
    </div>

    <!-- Middle: search (collapses on small screens) -->
    <div class="flex-1 max-w-xl mx-4">
      <div class="relative">
        <input
          v-model="query"
          type="search"
          placeholder="Search..."
          class="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1111.5 4.5a7.5 7.5 0 015.15 12.15z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Right: notifications + user -->
    <div class="flex items-center gap-4">
      <button class="p-2 rounded hover:bg-gray-100 text-gray-600 relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          v-if="notifications > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center"
          >{{ notifications }}</span
        >
      </button>

      <div class="relative">
        <button
          @click="toggleMenu"
          class="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
        >
          <div class="w-8 h-8 rounded-full bg-gray-200"></div>
          <div class="hidden md:block text-sm text-gray-700">Admin</div>
        </button>

        <div
          v-if="menuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-50"
        >
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
          <div class="border-t my-1"></div>
          <button
            @click="logout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const query = ref('')
const notifications = ref(2)
const menuOpen = ref(false)

function emitToggle() {
  emit('toggle-sidebar')
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function logout() {
  // placeholder: wire to auth/logout flow
  console.log('logout')
  menuOpen.value = false
}
</script>

<style scoped lang="scss">
header {
  position: sticky;
  top: 0;
  z-index: 40;
}

.rounded-full:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}
</style>
