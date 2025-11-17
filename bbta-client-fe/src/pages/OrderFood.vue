<template>
  <div class="min-h-screen bg-gray-50">
    <!-- category -->
    <div class="fixed h-12 w-full bg-white box-shadow flex top-0">
      <div class="h-full w-10 justify-center items-center flex">
        <i class="fa-solid fa-angle-left"></i>
      </div>
      <div class="grow"></div>
      <div class="h-full w-10 justify-center items-center flex">
        <i class="fa-solid fa-angle-right"></i>
      </div>
    </div>

    <!-- scroll items -->
    <div class="mt-12"></div>

    <!-- order -->
    <div></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.box-shadow {
  box-shadow: 0 4px 6px 0 rgba(28, 28, 28, 0.06);
}
</style>
