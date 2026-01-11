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
              <template v-for="serve of showServed" :key="serve.id + '' + serve.price">
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
                      <div
                        class="w-5 h-5 text-[10px] bg-[#8a7501] flex justify-center items-center rounded-full cursor-pointer"
                        @click="removeFromCart(serve.id, serve.price)"
                      >
                        <i class="fa-solid fa-minus text-white"></i>
                      </div>
                    </div>
                  </div>
                </el-col>
              </template>
            </el-row>

            <template v-if="removeServed.length != 0">
              <div class="flex justify-center mt-4">
                Các món trả lại sẽ không được tính vào hoá đơn thanh toán
              </div>

              <el-row class="mx-[0_!important]" :gutter="20">
                <template v-for="serve of removeServed" :key="serve.id + '' + serve.price">
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

                        <div
                          class="w-5 h-5 text-[10px] bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                          @click="addFromCart(serve.id, serve.price)"
                        >
                          <i class="fa-solid fa-plus text-white"></i>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </template>
              </el-row>
            </template>
          </div>
        </div>
        <div class="flex mb-7">
          <el-button @click="updateListServe" type="primary" size="large"
            >Xác nhận các món đã phục vụ</el-button
          >
        </div>
      </div>

      <div class="flex flex-col gap-2 w-[50%] p-3">
        <template v-if="!session.is_updated_served">
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
              <div class="flex justify-end mt-4 gap-2">
                <el-button @click="printBill" size="large" type="warning">In hóa đơn</el-button>
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
import router from '@/router'

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
  return `https://api.vietqr.io/image/970436-1040311053-lxMnomD.jpg?accountName=BBTA%20THAO&amount=${sum_price.value}`
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
  removeServed.value = []
}

const removeServed = ref([])

const showServed = computed(() => {
  const result = []

  for (const serve of sumaryServed.value) {
    const index_remove = removeServed.value.findIndex(
      (i) => i.id === serve.id && i.price === serve.price,
    )

    let quantity_remove = 0
    if (index_remove !== -1) {
      quantity_remove = removeServed.value[index_remove].quantity
    }

    if (serve.quantity - quantity_remove > 0) {
      result.push({
        ...serve,
        quantity: serve.quantity - quantity_remove,
      })
    }
  }

  return result
})

const removeFromCart = (food_id: string, price: number) => {
  const index = removeServed.value.findIndex((i) => i.id === food_id && i.price === price)
  const serve = sumaryServed.value.find((i) => i.id === food_id && i.price === price)!

  if (index === -1) {
    removeServed.value.push({ id: serve.id, food: serve.food, price, quantity: 1 })
  } else {
    removeServed.value[index].quantity += 1
  }
}

const addFromCart = (food_id: string, price: number) => {
  const index = removeServed.value.findIndex((i) => i.id === food_id && i.price === price)

  if (index !== -1) {
    removeServed.value[index].quantity -= 1

    if (removeServed.value[index].quantity <= 0) {
      removeServed.value.splice(index, 1)
    }
  }
}

const updateListServe = async () => {
  const list_serve = showServed.value.map((i) => ({
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

const confirmSession = async () => {
  await api.post('/serve-session/pay/' + serve_session_id, {
    money: sum_price.value,
  })

  await router.push('/home')
}

const printBill = () => {
  const printContent = document.createElement('div')
  printContent.innerHTML = `
    <h1 style="text-align: center;">HÓA ĐƠN THANH TOÁN</h1>
    <p>Mã phiên phục vụ: ${serve_session_id}</p>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #000; padding: 8px;">Tên món</th>
          <th style="border: 1px solid #000; padding: 8px;">Số lượng</th>
          <th style="border: 1px solid #000; padding: 8px;">Giá</th>
          <th style="border: 1px solid #000; padding: 8px;">Tổng giá món</th>
        </tr>
      </thead>
      <tbody>
        ${session.value.bills[0].items
          .map(
            (i) => `
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">${i.food_id.name}</td>
            <td style="border: 1px solid #000; padding: 8px;">${i.quantity}</td>
            <td style="border: 1px solid #000; padding: 8px;">${i.price.toLocaleString()} đ</td>
            <td style="border: 1px solid #000; padding: 8px;">${(i.quantity * i.price).toLocaleString()} đ</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
    <div style="display: flex; justify-content: center; margin-top: 20px;">
      <img id="qr-code" style="width: 200px; height: 200px;" src="${qrURL.value}" alt="" />
    </div>
    <h2 style="text-align: right;">Tổng giá: ${sum_price.value.toLocaleString()} đ</h2>
  `

  const printWindow = window.open('', '', 'width=800,height=800')
  printWindow!.document.write(printContent.innerHTML)
  printWindow!.document.close()
  printWindow!.focus()

  printWindow!.document.getElementById('qr-code')!.onload = () => {
    printWindow!.print()
    printWindow!.close()
  }
}
</script>

<style lang="scss"></style>
