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

    <!-- spacer for header -->
    <div class="mt-12"></div>

    <!-- main content with example items (click + to add to cart) -->
    <main class="max-w-2xl mx-auto px-3 pb-32">
      <div class="space-y-4 mt-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-white rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-sm text-gray-500">{{ item.description }}</div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-xl font-bold">{{ formatPrice(item.price) }}</div>
            <button @click="addToCart(item)" class="w-10 h-10 rounded-full bg-green-500 text-white">
              +
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- sticky bottom order bar (shows only when there are orders) -->
    <div v-if="orders.length > 0" class="fixed left-4 right-4 bottom-4 z-50 flex justify-center">
      <div class="bg-white rounded-full shadow-lg w-full max-w-2xl px-4 py-3 flex items-center">
        <div class="flex items-center gap-3">
          <div
            class="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-semibold"
          >
            {{ totalItems }}
          </div>
          <div>
            <div class="text-sm text-gray-500">View Order</div>
            <div class="font-bold text-lg">{{ formattedTotal }}</div>
          </div>
        </div>
        <div class="grow"></div>
        <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full">
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Item = { id: number; name: string; description?: string; price: number }

const items = ref<Item[]>([
  {
    id: 1,
    name: 'Special Rice in Claypot',
    description: 'Tasty bowl with egg and meat.',
    price: 84000,
  },
  { id: 2, name: 'Pork Rib Claypot Rice', description: 'Savory pork rib.', price: 70000 },
  { id: 3, name: 'Beef Claypot Rice', description: 'Tender beef.', price: 68000 },
])

const orders = ref<{ id: number; qty: number }[]>([])

function addToCart(item: Item) {
  const idx = orders.value.findIndex((o) => o.id === item.id)
  if (idx >= 0) orders.value[idx]!.qty += 1
  else orders.value.push({ id: item.id, qty: 1 })
}

const totalItems = computed(() => orders.value.reduce((s, o) => s + o.qty, 0))
const total = computed(() =>
  orders.value.reduce((sum, o) => {
    const it = items.value.find((i) => i.id === o.id)
    return sum + (it ? it.price * o.qty : 0)
  }, 0),
)
const formattedTotal = computed(() => formatPrice(total.value))

function formatPrice(v: number) {
  if (!v) return '0.000'
  return `${Math.round(v / 1000)}.000`
}
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 4px 6px 0 rgba(28, 28, 28, 0.06);
}
</style>
