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
        <div class="py-1 px-2 text-[12px] mb-2">
          Phiên phục vụ ID: <span class="font-bold">{{ serve_ss._id }}</span>
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

          <el-button type="primary" @click="goServeSession(serve_ss._id)"
            >Hiển thị QR cho khách hàng</el-button
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

  <el-drawer v-model="drawerSession" title="I am the title" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

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

// drawer
const drawerSession = ref(false)

const goServeSession = async (serve_session_id: string) => {
  const res = await api.get('/serve-session/' + serve_session_id)
  drawerSession.value = true
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
