<template>
  <div class="bg-gray-50 py-6 px-4 overflow-scroll h-screen">
    <header class="mb-6 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Đơn hàng của bạn</h1>
        <p class="text-sm text-slate-500">Kiểm tra trạng thái và chi tiết các đơn hiện tại</p>
      </div>
    </header>

    <div class="mb-4 bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div class="text-xs text-slate-400">Mã phiên</div>
          <div class="text-sm font-medium text-slate-800">{{ session._id || '-' }}</div>
        </div>
        <div>
          <div class="text-xs text-slate-400">Thời gian vào</div>
          <div class="text-sm text-slate-800">{{ formatDate(session.started_at) }}</div>
        </div>
        <div>
          <div class="text-xs text-slate-400">Bàn</div>
          <div class="text-sm text-slate-800">
            {{ session.table_ids?.map((i) => i.name).join(', ') || '-' }}
          </div>
        </div>
        <div class="flex items-center sm:justify-end">
          <button
            style="font-size: 12px"
            @click="router.push('/order-food')"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-[white_!important] rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 mr-1"
          >
            Đặt món
          </button>
          <button
            style="font-size: 12px"
            @click="router.push('/home')"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-[white_!important] rounded-md shadow-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex gap-1 flex-wrap">
        <div class="bg-green-100 text-green-700 text-[11px] font-medium px-2 py-1 rounded">
          Đã đặt món
        </div>
        <div class="bg-yellow-100 text-yellow-700 text-[11px] font-medium px-2 py-1 rounded">
          Đang chuẩn bị
        </div>
        <div class="bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-1 rounded">
          Đã phục vụ
        </div>
        <div class="bg-red-100 text-red-700 text-[11px] font-medium px-2 py-1 rounded">Đã huỷ</div>
      </div>
    </div>

    <div v-if="!orders || orders.length === 0" class="text-center text-slate-500 py-8">
      Không có đơn hàng.
    </div>

    <ul class="space-y-4">
      <li v-for="o in orders" :key="o._id" class="bg-white rounded-lg shadow p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <div class="text-sm text-slate-500">Mã đơn</div>
              <div class="text-base font-medium text-slate-900">#{{ o._id.slice(-6) }}</div>
            </div>
            <div class="text-sm text-slate-400">Đặt lúc: {{ formatDate(o.time_ordered) }}</div>
            <div class="text-sm text-slate-400">Cho bàn: {{ o.table_order_id?.name || '-' }}</div>
            <div class="mt-2 flex flex-col flex-wrap gap-2">
              <template v-if="o.ordered.length">
                <div class="flex gap-1 flex-wrap">
                  <div
                    v-for="item in o.ordered"
                    :key="item.food_id._id + '' + item.price"
                    class="bg-green-100 text-green-700 text-[11px] font-medium px-2 py-1 rounded"
                  >
                    {{ item.food_id.name }}: {{ formatCurrency(item.price) }} x{{ item.quantity }}
                  </div>
                </div>
              </template>

              <template v-if="o.preparing.length">
                <div class="flex gap-1 flex-wrap">
                  <div
                    v-for="item in o.preparing"
                    :key="item.food_id._id + '' + item.price"
                    class="bg-yellow-100 text-yellow-700 text-[11px] font-medium px-2 py-1 rounded"
                  >
                    {{ item.food_id.name }}: {{ formatCurrency(item.price) }} x{{ item.quantity }}
                  </div>
                </div>
              </template>

              <template v-if="o.served.length">
                <div class="flex gap-1 flex-wrap">
                  <div
                    v-for="item in o.served"
                    :key="item.food_id._id + '' + item.price"
                    class="bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-1 rounded"
                  >
                    {{ item.food_id.name }}: {{ formatCurrency(item.price) }} x{{ item.quantity }}
                  </div>
                </div>
              </template>

              <template v-if="o.cancelled.length">
                <div class="flex gap-1 flex-wrap">
                  <div
                    v-for="item in o.cancelled"
                    :key="item.food_id._id + '' + item.price"
                    class="bg-red-100 text-red-700 text-[11px] font-medium px-2 py-1 rounded"
                  >
                    {{ item.food_id.name }} x{{ item.quantity }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import { api } from '@/plugin/axios'
import router from '@/router'

const orders = ref<Array<any>>([])
const session = ref<any>({})

const getData = async () => {
  try {
    const serve_session_id = localStorage.getItem('serve-session-id')
    if (!serve_session_id) return
    const res = await api.get(`/serve-session/${serve_session_id}`)
    orders.value = res.data.order_serve_session || []
    session.value = res.data.serve_session || {}
  } catch (e) {
    console.error(e)
    orders.value = []
    session.value = {}
  }
}

const formatCurrency = (v: number) => {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(v || 0))
  } catch (e) {
    return String(v) + ' ₫'
  }
}

const formatDate = (d: string | number | undefined) => {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleString()
  } catch (e) {
    return String(d)
  }
}

const parsedOrders = computed(() => {
  return (orders.value || []).map((b: any) => {
    const items = (b.items || []).map((it: any) => ({
      name: it?.food_id?.name || it.name || 'Món',
      qty: it.quantity || 1,
      price: it.price || it?.food_id?.price || 0,
    }))
    const itemsCount = items.reduce((s: number, it: any) => s + it.qty, 0)
    const total = b.total || items.reduce((s: number, it: any) => s + it.qty * (it.price || 0), 0)
    return {
      id: b._id || b.id,
      shortId: String(b._id || b.id).slice(-6),
      time: b.createdAt
        ? new Date(b.createdAt).toLocaleString()
        : session.value?.createdAt
          ? new Date(session.value.createdAt).toLocaleString()
          : '-',
      itemsCount,
      total,
      itemsPreview: items.slice(0, 5).map((x: any) => `${x.name} x${x.qty}`),
      raw: b,
    }
  })
})

onMounted(async () => {
  await getData()
})
</script>

<style scoped></style>
