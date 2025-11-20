<template>
  <div class="h-screen bg-gray-50 overflow-auto">
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

    <div class="px-3 py-6 bg-white">
      <h2 class="font-semibold text-lg mb-6 text-2xl">For you</h2>
      <div class="flex flex-col">
        <div class="flex border-b border-[#f0efef] pb-4 gap-4">
          <div class="w-[100px] h-[100px]">
            <img src="@/assets/img/dish.png" alt="" class="w-[100px] h-[100px] max-w-[unset]" />
          </div>

          <div class="grow">
            <div class="font-normal break-all text-[1.15rem] w-full leading-normal mb-4">
              ten mon anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </div>

            <div class="text-[12px] leading-normal font-normal text-[#acacac] break-all mb-6">
              mô tả món ăn fasdf sadf jsdf asjdfhaskdfasfasfasdfasdfas fs a
            </div>

            <div class="flex justify-between items-center">
              <div class="text-[16px] leading-normal font-medium text-[#1c1c1c]">125.000 đ</div>

              <div
                class="w-8 h-8 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                @click="
                  addToCart({
                    id: 1,
                    name: 'dish',
                    price: 12,
                  })
                "
              >
                <i class="fa-solid fa-plus text-white"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="flex border-[#f0efef] pt-4 gap-4">
          <div class="w-[100px] h-[100px]">
            <img src="@/assets/img/dish.png" alt="" class="w-[100px] h-[100px] max-w-[unset]" />
          </div>

          <div class="grow">
            <div class="font-normal break-all text-[1.15rem] w-full leading-normal mb-4">
              ten mon anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </div>

            <div class="text-[12px] leading-normal font-normal text-[#acacac] break-all mb-6">
              mô tả món ăn fasdf sadf jsdf asjdfhaskdfasfasfasdfasdfas fs a
            </div>

            <div class="flex justify-between items-center">
              <div class="text-[16px] leading-normal font-medium text-[#1c1c1c]">125.000 đ</div>

              <div
                class="w-8 h-8 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                @click="
                  addToCart({
                    id: 2,
                    name: 'dish',
                    price: 20,
                  })
                "
              >
                <i class="fa-solid fa-plus text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-3 py-6 bg-white mt-3">
      <h2 class="font-semibold text-lg mb-6 text-2xl">For you</h2>
      <div class="flex flex-col">
        <div class="flex border-b border-[#f0efef] pb-4 gap-4">
          <div class="w-[100px] h-[100px]">
            <img src="@/assets/img/dish.png" alt="" class="w-[100px] h-[100px] max-w-[unset]" />
          </div>

          <div class="grow">
            <div class="font-normal break-all text-[1.15rem] w-full leading-normal mb-4">
              ten mon anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </div>

            <div class="text-[12px] leading-normal font-normal text-[#acacac] break-all mb-6">
              mô tả món ăn fasdf sadf jsdf asjdfhaskdfasfasfasdfasdfas fs a
            </div>

            <div class="flex justify-between items-center">
              <div class="text-[16px] leading-normal font-medium text-[#1c1c1c]">125.000 đ</div>

              <div
                class="w-8 h-8 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                @click="log()"
              >
                <i class="fa-solid fa-plus text-white"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="flex border-[#f0efef] pt-4 gap-4">
          <div class="w-[100px] h-[100px]">
            <img src="@/assets/img/dish.png" alt="" class="w-[100px] h-[100px] max-w-[unset]" />
          </div>

          <div class="grow">
            <div class="font-normal break-all text-[1.15rem] w-full leading-normal mb-4">
              ten mon anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </div>

            <div class="text-[12px] leading-normal font-normal text-[#acacac] break-all mb-6">
              mô tả món ăn fasdf sadf jsdf asjdfhaskdfasfasfasdfasdfas fs a
            </div>

            <div class="flex justify-between items-center">
              <div class="text-[16px] leading-normal font-medium text-[#1c1c1c]">125.000 đ</div>

              <div
                class="w-8 h-8 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
              >
                <i class="fa-solid fa-plus text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div></div>

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
                      {{ order.price }} đ
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
                <div class="font-bold text-lg">{{ 12 }}</div>
              </div>
            </div>
            <div class="grow"></div>
            <button class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { computed } from 'vue'

import { useOrderFood } from '@/stores/useOrderFood'

const showDetail = ref(false)
const { orders, addToCart, removeFromCart } = useOrderFood()

watch(
  orders,
  () => {
    if (orders.value.length === 0) {
      showDetail.value = false
      console.log('no orders', showDetail.value)
    }
  },
  { deep: true },
)

const totalItems = computed(() => {
  return orders.value.reduce((sum, item) => sum + item.quantity, 0)
})

const onClickHiddenDetail = () => {
  if (showDetail.value) {
    showDetail.value = false
  }
}

const onClickShowDetail = () => {
  if (!showDetail.value) {
    showDetail.value = true
    console.log('show detail', showDetail.value)
  }
}

const log = () => {
  console.log('clicked', showDetail.value)
}
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 4px 6px 0 rgba(28, 28, 28, 0.06);
}
</style>
