<template>
  <div class="flex gap-5 p-5 items-center">
    <div class="flex items-center gap-3">
      <span class="demonstration">Khoảng thời gian</span>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="đến"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        :clearable="false"
      />
    </div>

    <el-button type="primary" @click="getDashboardData">Áp dụng</el-button>
  </div>
  <div class="flex gap-5 p-5 items-start">
    <div class="bg-white rounded-lg p-4 shadow flex-[2.5]">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg text-slate-900">Doanh thu</h2>
        <div class="text-right">
          <div class="text-xs text-[#41ac94]">Tổng</div>
          <div class="text-2xl font-extrabold text-[#018afa]">
            {{ formatCurrency(totalRevenue) }}
          </div>
        </div>
      </div>
      <div class="bg-slate-50 rounded-md p-3 overflow-y-auto">
        <div class="space-y-2">
          <div
            v-for="session in sessionsInfo"
            :key="session._id"
            class="bg-white rounded-md p-2 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-sm font-medium text-slate-800">#{{ session.shortId }}</div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-sm text-slate-600">Bills: {{ session.billsCount }}</div>
                <div class="text-sm text-slate-600">Items: {{ session.itemsCount }}</div>
                <div class="text-sm font-semibold text-[#018afa]">
                  {{ formatCurrency(session.money) }}
                </div>
              </div>
            </div>
            <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600">
              <div>
                <div class="text-xs text-slate-400">Thời gian bắt đầu</div>
                <div class="text-sm text-slate-800">{{ session.start }}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400">Thời gian kết thúc</div>
                <div class="text-sm text-slate-800">{{ session.end }}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400">Bàn phục vụ</div>
                <div class="text-sm text-slate-800">{{ session.table_serve || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col gap-3">
      <div class="bg-white rounded-lg p-4 shadow">
        <h2 class="text-lg mb-3 text-slate-900">Món yêu thích</h2>
        <div class="mt-2 flex flex-col gap-3">
          <div v-for="(item, idx) in favorites" :key="item.id" class="overflow-hidden">
            <div
              class="transform -skew-y-6 bg-gradient-to-r from-white to-slate-100 flex items-center gap-3 p-3 rounded-md"
            >
              <div
                class="transform skew-y-6 w-11 text-white bg-[#018afa] text-center rounded-md py-1 font-bold"
              >
                #{{ idx + 1 }}
              </div>
              <div class="transform skew-y-6 flex-1 font-semibold text-slate-900">
                {{ item.name }}
              </div>
              <div class="transform skew-y-6 text-slate-600 font-semibold">
                {{ item.count }} lần
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow">
        <h2 class="text-lg mb-3 text-slate-900">Bàn yêu thích</h2>
        <div class="mt-2 flex flex-col gap-3">
          <div v-for="(item, idx) in tableFavorites" :key="item.id" class="overflow-hidden">
            <div
              class="transform -skew-y-6 bg-gradient-to-r from-white to-slate-100 flex items-center gap-3 p-3 rounded-md"
            >
              <div
                class="transform skew-y-6 w-11 text-white bg-[#41ac94] text-center rounded-md py-1 font-bold"
              >
                #{{ idx + 1 }}
              </div>
              <div class="transform skew-y-6 flex-1 font-semibold text-slate-900">
                {{ item.name }}
              </div>
              <div class="transform skew-y-6 text-slate-600 font-semibold">
                {{ item.count }} lần
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { api } from '@/plugin/axios'

const today = new Date()
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const dateRange = ref<Array<Date>>([startOfMonth, today])

const favorites = ref<Array<{ id: number; name: string; count: number }>>([])
const tableFavorites = ref<Array<{ id: number; name: string; count: number }>>([])
const allSessions = ref<Array<any>>([])

const totalRevenue = computed(() => {
  return allSessions.value.reduce((sum, session) => sum + session.money, 0)
})

const sessionsInfo = computed(() => {
  return allSessions.value.map((s: any) => {
    const bills = s.bills || []
    const items = bills.flatMap((b: any) => b.items || [])
    const itemsCount = items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)
    const shortId = String(s._id).slice(-6)
    const start = s.started_at ? new Date(s.started_at).toLocaleString() : s.started_at || '-'
    const end = s.ended_at ? new Date(s.ended_at).toLocaleString() : s.ended_at || '-'
    const table_serve = s.table_ids.map((t: any) => t.name).join(', ')
    return {
      _id: s._id,
      shortId,
      start,
      end,
      table_serve,
      billsCount: bills.length,
      itemsCount,
      money: s.money || 0,
    }
  })
})

const formatCurrency = (v: number) => {
  return v >= 1000 ? new Intl.NumberFormat('vi-VN').format(v / 1000) + 'k' : String(v)
}

const getDashboardData = async () => {
  const res = await api.get('/serve-session/dashboard/sumary', {
    params: {
      from: dateRange.value[0]!.toISOString(),
      to: dateRange.value[1]!.toISOString(),
    },
  })

  const allFood = []

  const serve_sessions = res.data.serve_sessions
  for (const session of serve_sessions) {
    for (const bill of session.bills) {
      for (const item of bill.items) {
        allFood.push(item)
      }
    }
  }

  const foodCountMap: Record<string, { id: number; name: string; count: number }> = {}
  for (const item of allFood) {
    if (foodCountMap[item.food_id._id]) {
      foodCountMap[item.food_id._id]!.count += item.quantity
    } else {
      foodCountMap[item.food_id._id] = {
        id: item.food_id._id,
        name: item.food_id.name,
        count: item.quantity,
      }
    }
  }

  const sortedFoods = Object.values(foodCountMap).sort((a, b) => b.count - a.count)
  favorites.value = sortedFoods.slice(0, 5)
  allSessions.value = serve_sessions

  const tableCountMap: Record<string, { id: number; name: string; count: number }> = {}
  for (const session of serve_sessions) {
    for (const table of session.table_ids) {
      if (tableCountMap[table._id]) {
        tableCountMap[table._id]!.count += 1
      } else {
        tableCountMap[table._id] = {
          id: table._id,
          name: table.name,
          count: 1,
        }
      }
    }
  }
  const sortedTables = Object.values(tableCountMap).sort((a, b) => b.count - a.count)
  tableFavorites.value = sortedTables.slice(0, 5)
}

onMounted(async () => {
  await getDashboardData()
})
</script>

<!-- Styling replaced with Tailwind CSS utility classes; no scoped styles needed -->
