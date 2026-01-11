<template>
  <div class="bg-gray-50 py-6 px-4 overflow-scroll h-screen">
    <header class="mb-6 flex items-start justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Hãy lựa chọn bàn để đặt</h1>
        <div class="flex items-center gap-2 mt-1">
          <p class="text-sm text-slate-500">
            Các bàn đang sử dụng hoặc đã được đặt sẽ không thể đặt chỗ
          </p>
          <button
            v-if="tableBook.length"
            class="w-[100px] p-1 rounded text-white font-semibold bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            @click="bookingTable"
          >
            Đặt bàn
          </button>
        </div>
      </div>
    </header>

    <template v-if="myBooking.length">
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-medium text-slate-900 mb-2">Các bàn bạn đã đặt</h2>
        <div
          v-for="b in myBooking"
          :key="b._id"
          class="mb-2 border-[1px] border-gray-200 rounded p-2"
        >
          <p class="text-sm text-slate-500 mb-1">
            Đặt vào: {{ new Date(b.booking_time).toLocaleString() }}
          </p>
          <div v-for="tableId in b.table_ids" :key="tableId" class="ml-4">
            <p class="text-sm text-slate-700">
              •
              {{ tables.find((t) => t._id === tableId)?.name || 'Bàn đã xóa hoặc không tồn tại' }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-for="t in tableCanBook" :key="t._id">
      <div
        class="rounded-lg shadow p-4 mb-4"
        @click="choseTable(t._id)"
        :class="{
          'bg-white': !tableBook.includes(t._id),
          'bg-blue-100 border-2 border-blue-500': tableBook.includes(t._id),
        }"
      >
        <h2 class="text-lg font-medium text-slate-900">{{ t.name }}</h2>
        <p class="text-sm text-slate-500">Số lượng người: {{ t.capacity }}</p>
        <div class="table-description mb-2">
          {{ t?.description }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { api } from '@/plugin/axios'
import router from '@/router'
import { useAuth } from '@/stores/useAuth'

const { customerId } = useAuth()
const tables = ref([])
const serve_session = ref([])
const table_booking = ref([])
const tableBook = ref([])

const myBooking = computed(() => {
  return table_booking.value.filter((tb: any) => tb.customer_id._id === customerId.value)
})

const tableCanBook = computed(() => {
  const bookedTableIds = table_booking.value.map((tb: any) => tb.table_ids).flat()
  const servingTableIds = serve_session.value.map((ss: any) => ss.table_ids).flat()

  return tables.value.filter(
    (table: any) => !bookedTableIds.includes(table._id) && !servingTableIds.includes(table._id),
  )
})

const getTables = async () => {
  const res = await api.get('/table')

  tables.value = res.data.tables
  serve_session.value = res.data.serve_session
  table_booking.value = res.data.table_booking.filter((ss: any) => ss.state === 'booking')
}

const choseTable = (tableId: string) => {
  const index = tableBook.value.indexOf(tableId)
  if (index === -1) {
    tableBook.value.push(tableId)
  } else {
    tableBook.value.splice(index, 1)
  }
}

const bookingTable = async () => {
  if (!tableBook.value.length) return

  try {
    await api.post('/table-booking', {
      customerId: customerId.value,
      table_ids: tableBook.value,
    })

    tableBook.value = []

    router.push('/home')
  } catch (error) {}
}

onMounted(async () => {
  if (!customerId.value) {
    router.push('/home')
    return
  }
  await getTables()
})
</script>

<style scoped>
.table-description {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 0.25rem;
  /* Preserve line breaks stored as "\n" and wrap long text */
  white-space: pre-wrap; /* honor newlines and wrap text */
  overflow-wrap: anywhere; /* allow breaking long words when necessary */
}
</style>
