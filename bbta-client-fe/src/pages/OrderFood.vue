<template>
  <div
    class="h-screen bg-gray-50 overflow-auto"
    :class="{
      'pb-20': orders.length,
    }"
  >
    <!-- category -->
    <!-- <div class="fixed h-12 w-full bg-white box-shadow flex top-0">
      <div class="h-full w-10 justify-center items-center flex">
        <i class="fa-solid fa-angle-left"></i>
      </div>
      <div class="grow"></div>
      <div class="h-full w-10 justify-center items-center flex">
        <i class="fa-solid fa-angle-right"></i>
      </div>
    </div> -->

    <template v-for="c in CATEGORIES" :key="c">
      <template v-if="groupedFoods[c]?.length">
        <div class="px-3 py-6 bg-white">
          <h2 class="font-semibold text-lg mb-2 text-2xl">{{ mapLabelCategory[c] }}</h2>
          <div class="flex flex-col">
            <template v-for="(f, index) in groupedFoods[c]" :key="f._id">
              <div
                class="flex border-[#f0efef] pt-4 gap-4"
                :class="{
                  'border-b pb-4': index !== groupedFoods[c].length - 1,
                }"
              >
                <div class="w-[100px] h-[100px]">
                  <img :src="f.image_url" alt="" class="w-[100px] h-[100px] max-w-[unset]" />
                </div>

                <div class="grow">
                  <div class="font-normal break-all text-[1.15rem] w-full leading-normal mb-4">
                    {{ f.name }}
                  </div>

                  <div class="text-[12px] leading-normal font-normal text-[#acacac] break-all mb-6">
                    {{ f.description }}
                  </div>

                  <div class="flex justify-between items-center">
                    <div class="text-[16px] leading-normal font-medium text-[#1c1c1c]">
                      {{ f.price.toLocaleString() }} đ
                      <span class="text-[#00b14f]">
                        {{
                          foodIdsInOrder.includes(f._id)
                            ? `x ${getFoodInOrder(f._id)?.quantity}`
                            : ''
                        }}
                      </span>
                    </div>

                    <div class="flex gap-2">
                      <div
                        v-if="foodIdsInOrder.includes(f._id)"
                        class="w-8 h-8 bg-[#8a7501] flex justify-center items-center rounded-full cursor-pointer"
                        @click="removeFromCart(f._id)"
                      >
                        <i class="fa-solid fa-minus text-white"></i>
                      </div>

                      <div
                        class="w-8 h-8 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                        @click="
                          addToCart({
                            id: f._id,
                            name: f.name,
                            price: f.price,
                          })
                        "
                      >
                        <i class="fa-solid fa-plus text-white"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>

    <!-- sticky bottom order bar (shows only when there are orders) -->
    <template v-if="orders.length && showDetail">
      <div
        class="fixed top-0 left-0 right-0 bottom-0 bg-[#c8e9bf3a] bg-opacity-30 z-40"
        @click="onClickHiddenDetail()"
      ></div>
    </template>

    <template v-if="orders.length">
      <div
        class="fixed left-4 right-4 bottom-4 z-50 flex justify-center max-h-1/2 border-[#e5e5e5] border overflow-hidden"
        :class="{
          'rounded-lg': showDetail,
          'rounded-full': !showDetail,
        }"
        @click="onClickShowDetail()"
      >
        <div class="bg-white shadow-lg w-full max-w-2xl px-4 py-3 flex flex-col">
          <template v-if="showDetail">
            <template v-for="(order, index) in orders" :key="order.id">
              <div class="flex justify-between items-start mb-2 gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-semibold"
                  >
                    {{ order.quantity }}
                  </div>
                </div>
                <div
                  class="grow flex border-[#b39a9a] gap-3 h-full"
                  :class="{
                    'border-b': index !== orders.length - 1,
                    'pb-2': index !== orders.length - 1,
                  }"
                >
                  <div class="grow flex flex-col">
                    <div class="font-semibold text-sm break-all">{{ order.name }}</div>
                    <div class="break-all text-[12px] leading-normal font-medium text-[#1c1c1c]">
                      {{ order.price?.toLocaleString() }} đ
                    </div>
                  </div>

                  <div class="flex gap-2 items-end h-full">
                    <div
                      class="w-6 h-6 bg-[#8a7501] flex justify-center items-center rounded-full cursor-pointer"
                      @click.stop="removeFromCart(order.id)"
                    >
                      <i class="fa-solid fa-minus text-white text-[12px]"></i>
                    </div>

                    <div
                      class="w-6 h-6 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                      @click.stop="addToCart(order)"
                    >
                      <i class="fa-solid fa-plus text-white text-[12px]"></i>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="border-b border-[#b39a9a] mb-2"></div>
          </template>

          <div class="flex justify-between">
            <div class="flex items-center gap-3">
              <div
                class="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-semibold"
              >
                {{ totalItems }}
              </div>
              <div>
                <div class="font-bold text-lg">{{ totalPrice.toLocaleString() }} đ</div>
              </div>
            </div>
            <div class="grow"></div>
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full"
              @click.stop="orderFood()"
            >
              Đặt món
            </button>
          </div>
        </div>
      </div>
    </template>

    <van-popup v-model:show="showPicker" destroy-on-close round position="bottom">
      <van-picker
        :model-value="table_id_picker"
        title="Chọn bàn đặt món"
        cancel-button-text="Hủy"
        confirm-button-text="Xác nhận"
        :columns="pickers"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { computed } from 'vue'

import { api } from '@/plugin/axios'
import router from '@/router'
import { useOrderFood } from '@/stores/useOrderFood'
import { CATEGORIES, mapLabelCategory } from '@/utils/categories'

const groupedFoods = ref<{ [key in (typeof CATEGORIES)[number]]: any[] }>({})

const showDetail = ref(false)
const { orders, addToCart, removeFromCart } = useOrderFood()

const foodIdsInOrder = computed(() => orders.value.map((o) => o.id))

const getFoodInOrder = (foodId: number) => {
  return orders.value.find((o) => o.id === foodId)
}

watch(
  orders,
  () => {
    if (orders.value.length === 0) {
      showDetail.value = false
    }
  },
  { deep: true },
)

const totalItems = computed(() => {
  return orders.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return orders.value.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0)
})

const onClickHiddenDetail = () => {
  if (showDetail.value) {
    showDetail.value = false
  }
}

const onClickShowDetail = () => {
  if (!showDetail.value) {
    showDetail.value = true
  }
}

const orderFood = () => {
  showPicker.value = true
}

const getFood = async () => {
  const res = await api.get('/food')

  const foods = res.data

  // group foods by category
  const f = foods.reduce((groups, food) => {
    const category = food.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(food)
    return groups
  }, {})

  groupedFoods.value = f
}

const showPicker = ref(false)
const tables = ref([])
const table_id_picker = ref([])

const pickers = computed(() => {
  return tables.value.map((table) => ({
    text: table.name,
    value: table._id,
  }))
})

const getSession = async () => {
  const serveSession = localStorage.getItem('serve-session-id')

  if (!serveSession) {
    router.push('/home')
    return
  }

  if (!serveSession) return
  const res = await api.get(`/serve-session/${serveSession}`)

  tables.value = res.data.serve_session.table_ids
  table_id_picker.value = tables.value.length > 0 ? [tables.value[0]._id] : []
}

const onConfirm = async ({ selectedValues }) => {
  const serve_session_id = localStorage.getItem('serve-session-id')

  if (!serve_session_id) return

  table_id_picker.value = selectedValues

  if (table_id_picker.value.length === 0) return

  const table_order_id = table_id_picker.value[0]
  const ordered = orders.value.map((o) => ({
    food_id: o.id,
    quantity: o.quantity,
    price: o.price,
  }))

  await api.post('/order/create', {
    serve_session_id,
    table_order_id,
    ordered,
  })

  orders.value = []
  showDetail.value = false
  showPicker.value = false

  router.push('/my-order')
}

onMounted(async () => {
  await getFood()
  await getSession()
})
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 4px 6px 0 rgba(28, 28, 28, 0.06);
}
</style>
