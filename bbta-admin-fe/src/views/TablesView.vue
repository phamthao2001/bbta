<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold mb-4">Danh sách bàn</h2>

      <el-button type="primary" @click="addTable()"
        >Thêm bàn <i class="fa-solid fa-plus ml-1"></i
      ></el-button>
    </div>
    <div class="p-1">
      <el-row class="mb-5" :gutter="20">
        <el-col :span="6">
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
                <div class="table-title">Table 1</div>

                <div class="table-description">banf gan cho nay cho kia</div>
              </div>

              <div class="flex justify-end mt-4">
                <el-button size="small" type="warning">Cập nhật</el-button>
                <el-button size="small" type="danger">Xóa</el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
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
                <div class="table-title">Table 1</div>

                <div class="table-description">banf gan cho nay cho kia</div>
              </div>

              <div class="flex justify-end mt-4">
                <el-button size="small" type="warning">Cập nhật</el-button>
                <el-button size="small" type="danger">Xóa</el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
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
                <div class="table-title">Table 1</div>

                <div class="table-description">banf gan cho nay cho kia</div>
              </div>

              <div class="flex justify-end mt-4">
                <el-button size="small" type="warning">Cập nhật</el-button>
                <el-button size="small" type="danger">Xóa</el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
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
                <div class="table-title">Table 1</div>

                <div class="table-description">
                  banf gan cho nay cho kiadfasdf asdf asdf asd fasjdf jsafas fasfasdfasd à a
                </div>
              </div>

              <div class="flex justify-end mt-4">
                <el-button size="small" type="warning">Cập nhật</el-button>
                <el-button size="small" type="danger">Xóa</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
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
                <div class="table-title">Table 1</div>

                <div class="table-description">banf gan cho nay cho kia</div>
              </div>

              <div class="flex justify-end mt-4">
                <el-button size="small" type="warning">Cập nhật</el-button>
                <el-button size="small" type="danger">Xóa</el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
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
                <div class="table-title">Table 1</div>

                <div class="table-description">banf gan cho nay cho kia</div>
              </div>

              <div class="flex justify-end mt-4">
                <el-button size="small" type="warning">Cập nhật</el-button>
                <el-button size="small" type="danger">Xóa</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

  <el-dialog v-model="openDialog" title="Thêm bàn" width="600">
    <div class="flex justify-center p-2">
      <el-form label-width="auto" style="width: 400px">
        <el-form-item label="Tên bàn">
          <el-input />
        </el-form-item>

        <el-form-item label="Số lượng ghế">
          <el-input-number controls-position="right" />
        </el-form-item>

        <el-form-item label="Mô tả">
          <el-input :autosize="{ minRows: 4, maxRows: 4 }" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="openDialog = false">Hủy</el-button>
        <el-button type="primary" @click="openDialog = false">Thêm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tables = ref([])

const openDialog = ref(false)

const addTable = () => {
  openDialog.value = true
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
}
</style>
