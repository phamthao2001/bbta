<template>
  <div class="w-screen h-screen flex flex-col">
    <HeaderSection />

    <div class="flex-1 flex">
      <SidebarSection />

      <main class="flex-1 overflow-auto bg-gray-50 h-[calc(100vh-64px)]">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderSection from './HeaderSection.vue'
import SidebarSection from './SidebarSection.vue'
</script>

<style lang="scss"></style>
