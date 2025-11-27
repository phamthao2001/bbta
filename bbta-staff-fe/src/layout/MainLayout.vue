<template>
  <div class="w-screen h-screen flex flex-col">
    <HeaderSection />

    <div class="flex-1 flex h-[calc(100vh-64px)] overflow-auto bg-gray-50 min-w-screen">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderSection from './HeaderSection.vue'
</script>

<style lang="scss"></style>
