<template>
  <div class="w-full h-full">
    <div class="flex h-full">
      <div class="flex flex-col gap-2 w-[50%] p-3 border-r">
        <div class="text-[16px] font-medium mb-2">
          Tổng hợp các món đã phục vụ tại phiên {{ serve_session_id }}
        </div>
        <div class="flex-1 overflow-hidden">
          <div class="h-full overflow-auto">
            <el-row class="mx-[0_!important]" :gutter="20">
              <template v-for="serve of sumaryServed" :key="serve.id + '' + serve.price">
                <el-col :span="12">
                  <div
                    class="border border-blue-500 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
                  >
                    <div class="flex justify-between p-2 border-blue-500">
                      <div class="flex gap-2">
                        <div class="h-[70px] w-[70px]">
                          <img :src="serve.food.image_url" alt="" />
                        </div>
                        <div>
                          <div class="font-semibold text-[17px] break-all">
                            {{ serve.food.name }}
                          </div>
                          <div
                            class="break-all text-[16px] leading-normal font-medium text-green-400"
                          >
                            Số lượng: {{ serve.quantity }}
                          </div>
                          <div
                            class="break-all text-[16px] leading-normal font-medium text-[#1c1c1c]"
                          >
                            Giá: {{ serve.price.toLocaleString() }} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </template>
            </el-row>
          </div>
        </div>
        <div class="flex mb-7">
          <el-button
            v-if="session.is_updated_served"
            @click="updateListServe"
            type="primary"
            size="large"
            >Xác nhận các món đã phục vụ</el-button
          >
        </div>
      </div>

      <div class="flex flex-col gap-2 w-[50%] p-3">
        <template v-if="session.is_updated_served">
          <div class="flex h-full w-full justify-center items-center">
            Có cập nhật các món phục vụ, hãy Xác nhận để thực hiện thanh toán
          </div>
        </template>
        <template v-else>
          <template v-if="session.type_bill === 'default'">
            <div class="text-[16px] font-medium mb-2">Hoá đơn mặc định</div>
            <div class="flex-1 overflow-hidden">
              <div class="h-full overflow-auto flex flex-col">
                <template
                  v-for="i in session?.bills?.[0]?.items ?? []"
                  :key="i.food_id._id + '' + i.price"
                >
                  <div
                    class="border mx-20 border-blue-500 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
                  >
                    <div class="flex justify-between p-2 border-blue-500 w-full">
                      <div class="flex gap-2 justify-between w-full">
                        <div class="flex gap-2">
                          <div class="h-[70px] w-[70px]">
                            <img :src="i.food_id.image_url" alt="" />
                          </div>
                          <div>
                            <div class="font-semibold text-[17px] break-all">
                              {{ i.food_id.name }}
                            </div>
                            <div
                              class="break-all text-[16px] leading-normal font-medium text-green-400"
                            >
                              Số lượng: {{ i.quantity }}
                            </div>
                            <div
                              class="break-all text-[16px] leading-normal font-medium text-[#1c1c1c]"
                            >
                              Giá: {{ i.price.toLocaleString() }} đ
                            </div>
                          </div>
                        </div>
                        <div class="flex items-end">
                          <div
                            class="break-all text-[16px] leading-normal font-medium text-[#1c1c1c]"
                          >
                            Tổng giá món: {{ (i.quantity * i.price).toLocaleString() }} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div
              class="flex mx-20 text-[20px] leading-normal font-medium text-[#028a3b] justify-end"
            >
              Tổng giá: {{ sum_price.toLocaleString() }} đ
            </div>
            <div class="flex justify-center">Quét QR bên dưới để chuyển khoản cho cửa hàng</div>
            <div class="flex flex-col justify-center">
              <div class="flex justify-center">
                <img class="w-[200px] h-[200px]" :src="qrURL" alt="" />
              </div>
              <div class="flex justify-end mt-4">
                <el-button @click="confirmSession" size="large" type="primary"
                  >Xác nhận đã thanh toán</el-button
                >
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/plugin/axios'

const route = useRoute()

const { serve_session_id } = route.params

const session = ref({})
const orders_sess = ref([])
const sumaryServed = ref([])
const sum_price = computed(() => {
  const bills = session.value.bills ?? []

  let total = 0
  for (const bill of bills) {
    const items = bill.items

    for (const i of items) {
      total += i.price * i.quantity
    }
  }

  return total
})

const qrURL = computed(() => {
  return `https://img.vietqr.io/image/vpbank-2746520062001-compact2.jpg?amount=${sum_price.value}&addInfo={#user}&accountName=bbta`
})

const getAllOrder = async () => {
  const res = await api.get('/serve-session/' + serve_session_id)

  const orders = res.data.order_serve_session
  session.value = res.data.serve_session
  orders_sess.value = orders

  const served_orders = []

  for (const order of orders) {
    const served_o = order.served ?? []

    for (const s of served_o) {
      const { food_id, price, quantity } = s

      const index_exist = served_orders.findIndex((i) => i.id === food_id._id && i.price === price)

      if (index_exist !== -1) {
        served_orders[index_exist].quantity += quantity
      } else {
        served_orders.push({
          id: food_id._id,
          food: food_id,
          price,
          quantity,
        })
      }
    }
  }

  sumaryServed.value = served_orders
}

const updateListServe = async () => {
  const list_serve = sumaryServed.value.map((i) => ({
    food_id: i.id,
    price: i.price,
    quantity: i.quantity,
  }))

  await api.post('/serve-session/gen-bill', {
    type: 'default',
    ss: serve_session_id,
    bills: [
      {
        items: list_serve,
      },
    ],
  })

  await getAllOrder()
}

onMounted(async () => {
  await getAllOrder()
})

const confirmSession = async () => {}
</script>

<style lang="scss"></style>
