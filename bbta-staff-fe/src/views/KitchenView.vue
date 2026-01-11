<template>
  <div class="w-screen h-screen overflow-auto flex flex-col p-2">
    <template v-if="allOrders.length">
      <template v-for="order in allOrders" :key="order._id">
        <div class="p-4 bg-white rounded-lg border border-gray-200 shadow mb-4 mx-4">
          <div>Mã đơn: {{ order._id }}</div>

          <div class="flex border rounded-lg border-gray-200 mt-4 gap-2 p-4 flex-wrap">
            <template v-for="item in order.preparing" :key="item.food_id._id">
              <div class="border rounded-2xl w-[calc(50%_-_20px)] border-gray-200 py-2 flex px-4">
                <div class="w-[100px] h-[100px]">
                  <img
                    :src="item.food_id.image_url"
                    alt=""
                    class="w-[100px] h-[100px] max-w-[unset]"
                  />
                </div>
                <div class="ml-4">
                  <div class="font-semibold">{{ item.food_id.name }}</div>
                  <div class="text-sm text-gray-500">Số lượng: {{ item.quantity }}</div>
                  <div class="text-sm text-gray-500">Bàn: {{ item.table_id.name }}</div>
                </div>
                <div class="flex items-end h-full ml-auto">
                  <button
                    class="px-3 py-1 bg-green-600 text-white rounded-lg"
                    @click="serveFood(order._id, item.food_id._id)"
                  >
                    Ra 1 món
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>

    <template v-else>
      <div class="flex-1 flex flex-col items-center justify-center text-gray-500">
        <i class="fa-solid fa-kitchen-set text-6xl mb-4"></i>
        <div class="text-lg">Chưa có đơn hàng cần phục vụ</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { api } from '@/plugin/axios'

const allOrders = ref([])

const getFoodOrder = async () => {
  const { data } = await api.get('/orders/for-kitchen')

  allOrders.value = data.allOrders
}

const serveFood = async (orderId: string, foodId: string) => {
  try {
    await api.post('/order/serve-food', {
      items: [
        {
          order_id: orderId,
          serveItems: [
            {
              food_id: foodId,
              quantity: 1,
            },
          ],
        },
      ],
    })

    await getFoodOrder()
  } catch (error) {}
}

onMounted(async () => {
  await getFoodOrder()
})
</script>

<style lang="scss"></style>
