<template>
  <div class="p-4 w-full">
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" @click="openDialogAddSessionService()"
        >Khởi tạo lượt khách hàng<i class="fa-solid fa-plus ml-1"></i
      ></el-button>
    </div>

    <template v-for="serve_ss in serve_session" :key="serve_ss._id">
      <div
        class="p-1 mb-4 border border-gray-200 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="py-1 px-2 text-[12px] mb-1">
          Phiên phục vụ ID: <span class="font-bold">{{ serve_ss._id }}</span>
        </div>
        <div class="py-1 px-2 text-[12px] mb-2">
          Thời điểm vào: <span class="font-bold">{{ formatDate(serve_ss.started_at) }}</span>
        </div>
        <el-row :gutter="20">
          <template v-for="t_id in serve_ss.table_ids" :key="t_id">
            <el-col :span="4">
              <div class="h-full pb-4">
                <div
                  class="flex p-2 border border-gray-200 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow h-full"
                >
                  <div
                    class="w-14 h-14 flex justify-center items-center bg-blue-500 text-white rounded-full mr-2"
                  >
                    <i class="fa-solid fa-bell-concierge text-2xl"></i>
                  </div>

                  <div class="flex-1 flex flex-col gap-1 justify-between">
                    <div>
                      <div class="table-title">{{ tables.find((t) => t._id === t_id)?.name }}</div>

                      <div class="table-description mb-2">
                        {{ tables.find((t) => t._id === t_id)?.description }}
                      </div>
                      <div class="table-description">
                        Số lượng ghế: {{ tables.find((t) => t._id === t_id)?.capacity }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </template>
        </el-row>

        <div class="flex py-2 px-4">
          <el-button type="primary" @click="goServeSession(serve_ss._id)">Truy cập phiên</el-button>

          <el-button type="info" @click="showQRCode(serve_ss.code_login)"
            >Hiển thị QR đăng nhập</el-button
          >
        </div>
      </div>
    </template>
    <div class="p-1">
      <el-row :gutter="20">
        <template v-for="t in table_inactive" :key="t._id">
          <el-col :span="4">
            <div class="h-full pb-4">
              <div
                class="flex p-2 border border-gray-200 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow h-full"
              >
                <div
                  class="w-14 h-14 flex justify-center items-center bg-blue-500 text-white rounded-full mr-2"
                >
                  <i class="fa-solid fa-bell-concierge text-2xl"></i>
                </div>

                <div class="flex-1 flex flex-col gap-1 justify-between">
                  <div>
                    <div class="table-title">{{ t.name }}</div>

                    <div class="table-description mb-2">{{ t.description }}</div>
                    <div class="table-description">Số lượng ghế: {{ t.capacity }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>

  <el-dialog v-model="openDialog" title="Chọn bàn cho khách hàng" width="600">
    <div class="flex justify-center p-2">
      <el-form label-width="auto" style="width: 400px">
        <div class="mb-4 font-bold">
          Tổng số ghế:
          {{
            formSession.tables.reduce((total, tableId) => {
              const table = tables.find((t) => t._id === tableId)
              return total + (table ? table.capacity : 0)
            }, 0)
          }}
        </div>
        <el-form-item label="Danh sách bàn">
          <el-select
            v-model="formSession.tables"
            multiple
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in table_inactive"
              :key="item._id"
              :label="item.name + ' (Số ghế: ' + item.capacity + ')'"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog()">Hủy</el-button>
        <el-button type="primary" @click="addTable()">Tạo</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="qrcodeShowRef" title="QR Code đăng nhập cho khách hàng">
    <div class="flex justify-center p-4">
      <qrcode-vue
        :value="qrCodeValue"
        :size="200"
        :level="'M'"
        :bg-color="'#ffffff'"
        :fg-color="'#000000'"
      />
    </div>
  </el-dialog>

  <el-drawer v-model="drawerSession" title="I am the title" :with-header="false">
    <div class="h-full flex flex-col">
      <div class="py-1 px-2 text-[14px] mb-1">
        Phiên phục vụ: <span class="font-bold">{{ detailServeSession._id }}</span>
      </div>
      <div class="py-1 px-2 text-[12px] mb-2">
        Thời điểm vào:
        <span class="font-bold">{{ formatDate(detailServeSession.started_at) }}</span>
      </div>
      <el-tabs v-model="tableIdSession">
        <template v-for="table in detailServeSession.table_ids" :key="table._id">
          <el-tab-pane :label="table.name" :name="table._id"> </el-tab-pane>
        </template>
      </el-tabs>
      <el-tabs v-model="state_order">
        <el-tab-pane label="Đã đặt" name="ordered"> </el-tab-pane>
        <el-tab-pane label="Đã hủy" name="canceled"> </el-tab-pane>
        <el-tab-pane label="Đang chuẩn bị" name="preparing"> </el-tab-pane>
        <el-tab-pane label="Đã phục vụ" name="served"> </el-tab-pane>
      </el-tabs>

      <div class="flex-1 flex flex-col">
        <template v-if="state_order === 'ordered'">
          <div class="font-bold text-sm text-green-600">Đơn chuẩn bị</div>
          <template v-if="hasOrderItems">
            <template v-for="o in ordered" :key="o._id">
              <div
                class="border border-gray-200 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
              >
                <div class="text-[12px] px-2 py-1">
                  Mã số đơn: <span class="font-bold">{{ o._id }}</span>
                </div>
                <div class="text-[12px] px-2 border-b border-gray-200">
                  Thời điểm đặt: <span class="font-bold">{{ formatDate(o.time_ordered) }}</span>
                </div>
                <template v-if="o.ordered.length > 0">
                  <template v-for="(item, index) in o.ordered" :key="item._id">
                    <div
                      class="flex justify-between p-2 border-gray-200"
                      :class="{
                        'border-b': index < o.ordered.length - 1,
                      }"
                    >
                      <div class="flex gap-2">
                        <div class="h-[50px] w-[50px]">
                          <img :src="item.food_id.image_url" alt="" />
                        </div>
                        <div>
                          <div class="font-semibold text-sm break-all">{{ item.food_id.name }}</div>
                          <div
                            class="break-all text-[12px] leading-normal font-medium text-[#1c1c1c]"
                          >
                            Số lượng: {{ item.quantity }}
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col justify-between">
                        <div class="font-medium text-sm text-green-600">
                          {{ (item.food_id.price * item.quantity).toLocaleString() }} đ
                        </div>
                        <div class="flex justify-end">
                          <div
                            class="w-4 h-4 bg-[#8a7501] flex justify-center items-center rounded-full cursor-pointer"
                            @click="onAddCancel(o._id, item.food_id)"
                          >
                            <i class="fa-solid fa-minus text-white text-[8px]"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="p-4 text-[13px] text-center text-gray-500">
                    Các món trong đơn đang xác nhận hủy
                  </div>
                </template>
              </div>
            </template>
          </template>
          <div v-if="hasCanceledOrder" class="font-bold text-sm text-red-600">Xác nhận hủy</div>
          <template v-for="o in ordered" :key="o._id">
            <template v-if="Object.keys(canceled_order).includes(o._id)">
              <div
                class="border border-gray-200 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
              >
                <div class="text-[12px] px-2 py-1">
                  Mã số đơn: <span class="font-bold">{{ o._id }}</span>
                </div>

                <template v-for="(item, index) in canceled_order[o._id]" :key="item.food_id">
                  <div
                    class="flex justify-between p-2 border-gray-200"
                    :class="{
                      'border-b': index < canceled_order[o._id].length - 1,
                    }"
                  >
                    <div class="flex gap-2">
                      <div class="h-[50px] w-[50px]">
                        <img :src="item.image_url" alt="" />
                      </div>
                      <div>
                        <div class="font-semibold text-sm break-all">{{ item.name }}</div>
                        <div
                          class="break-all text-[12px] leading-normal font-medium text-[#1c1c1c]"
                        >
                          Số lượng: {{ item.quantity }}
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col justify-between">
                      <div class="flex justify-end">
                        <div
                          class="w-4 h-4 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                          @click="removeCancel(o._id, item.food_id)"
                        >
                          <i class="fa-solid fa-plus text-white text-[8px]"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </template>
      </div>

      <div class="flex mt-2">
        <template v-if="state_order === 'ordered'">
          <div class="flex w-full justify-between">
            <el-button type="primary">Thêm món</el-button>

            <el-button @click="cancelFood" type="primary">Xác nhận chuẩn bị</el-button>
          </div>
        </template>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'

import { URL_CLIENT } from '@/constant'
import { api } from '@/plugin/axios'

const tables = ref([])
const serve_session = ref([])

const table_ids_active = computed(() => {
  return serve_session.value.map((session) => session.table_ids).flat()
})

const table_inactive = computed(() => {
  return tables.value.filter((table) => !table_ids_active.value.includes(table._id))
})

const openDialog = ref(false)
const formSession = reactive({
  tables: [],
})

const openDialogAddSessionService = () => {
  openDialog.value = true
}

const addTable = async () => {
  try {
    const res = await api.post('/serve-session/create', {
      table_ids: formSession.tables,
    })

    const { _id } = res.data

    console.log('Created serve session with ID:', _id)
  } catch (error) {
    console.error('Error creating serve session:', error)
  }

  await getTables()
  closeDialog()
}

const closeDialog = () => {
  openDialog.value = false

  formSession.tables = []
}

const getTables = async () => {
  const res = await api.get('/table')

  tables.value = res.data.tables
  serve_session.value = res.data.serve_session
}

onMounted(async () => {
  await getTables()
})

// QRcode
const qrcodeShowRef = ref(false)
const qrCodeValue = ref('')

const showQRCode = (code_login: string) => {
  const qrCodeUrl = `${URL_CLIENT}/code-login?code_login=${code_login}`
  qrCodeValue.value = qrCodeUrl
  qrcodeShowRef.value = true
}

// drawer
const drawerSession = ref(false)
const detailServeSession = ref({})
const tableIdSession = ref()
const state_order = ref('ordered')
const order_session = shallowRef([])

const canceled_order = ref({})

const ordered = computed(() => {
  let order_section_table = order_session.value.filter(
    (o) => o.table_order_id._id === tableIdSession.value,
  )

  order_section_table = JSON.parse(JSON.stringify(order_section_table))

  const order_cancel = Object.keys(canceled_order.value)
  order_cancel.forEach((order_id) => {
    const orderIndex = order_section_table.findIndex((o) => o._id === order_id)
    if (orderIndex !== -1) {
      const canceledItems = canceled_order.value[order_id]
      canceledItems.forEach((canceledItem: any) => {
        const itemIndex = order_section_table[orderIndex].ordered.findIndex(
          (item: any) => item.food_id._id === canceledItem.food_id,
        )
        if (itemIndex !== -1) {
          order_section_table[orderIndex].ordered[itemIndex].quantity -= canceledItem.quantity
        }
      })
      // Remove items with quantity <= 0
      order_section_table[orderIndex].ordered = order_section_table[orderIndex].ordered.filter(
        (item: any) => item.quantity > 0,
      )
    }
  })

  return order_section_table
})

const hasOrderItems = computed(() => {
  return ordered.value.some((o) => o.ordered.length > 0)
})

const hasCanceledOrder = computed(() => {
  const orderIds = ordered.value.map((o) => o._id)
  return orderIds.some((id) => Object.keys(canceled_order.value).includes(id))
})

const onAddCancel = (order_id: string, food_id: any) => {
  const existing = canceled_order.value[order_id]
  if (existing) {
    const foodIndex = existing.findIndex((item: any) => item.food_id === food_id._id)
    if (foodIndex !== -1) {
      existing[foodIndex].quantity += 1
    } else {
      existing.push({
        food_id: food_id._id,
        quantity: 1,
        name: food_id.name,
        image_url: food_id.image_url,
      })
    }
  } else {
    canceled_order.value[order_id] = [
      { food_id: food_id._id, quantity: 1, name: food_id.name, image_url: food_id.image_url },
    ]
  }
}

const removeCancel = (order_id: string, food_id: string) => {
  const existing = canceled_order.value[order_id]
  if (existing) {
    const foodIndex = existing.findIndex((item: any) => item.food_id === food_id)
    if (foodIndex !== -1) {
      existing[foodIndex].quantity -= 1
      if (existing[foodIndex].quantity <= 0) {
        existing.splice(foodIndex, 1)
      }
      if (existing.length === 0) {
        delete canceled_order.value[order_id]
      }
    }
  }
}

const canceled = computed(() => {
  let order_section_table = order_session.value.filter(
    (o) => o.table_order_id._id === tableIdSession.value,
  )

  order_section_table = JSON.parse(JSON.stringify(order_section_table))

  return order_section_table
})

const goServeSession = async (serve_session_id: string) => {
  const res = await api.get('/serve-session/' + serve_session_id)
  detailServeSession.value = res.data.serve_session
  tableIdSession.value = res.data.serve_session.table_ids[0]?._id
  order_session.value = res.data.order_serve_session
  state_order.value = 'ordered'
  canceled_order.value = {}

  drawerSession.value = true
}

const cancelFood = async () => {
  const items = []

  for (const order_id of ordered.value.map((o) => o._id)) {
    const canceledItems = canceled_order.value[order_id]
    items.push({
      order_id,
      cancelItems: (canceledItems ?? []).map((i) => ({
        food_id: i.food_id,
        quantity: i.quantity,
      })),
    })
  }

  // call api to cancel food
  await api.post('/order/cancel-food', {
    items,
  })

  // refresh order session
  const res = await api.get('/serve-session/' + detailServeSession.value._id)
  order_session.value = res.data.order_serve_session
  canceled_order.value = {}
}

/**
 * Format a date/timestamp string into a friendly Vietnamese date/time.
 * Accepts ISO string, timestamp (number) or any string parseable by Date.
 */
function formatDate(input: string | number | undefined | null) {
  if (!input) return '-'
  const d = typeof input === 'number' ? new Date(input) : new Date(String(input))
  if (Number.isNaN(d.getTime())) return String(input)

  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
</script>

<style lang="scss" scoped>
.table-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.5;
}

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
