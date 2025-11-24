<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold mb-4">Thực đơn</h2>

      <el-button type="primary" @click="addFood()">
        Thêm món ăn <i class="fa-solid fa-plus ml-1"></i>
      </el-button>
    </div>

    <div class="p-3">
      <el-table :data="foods" border>
        <el-table-column prop="image_url" label="Ảnh minh họa" />
        <el-table-column prop="name" label="Tên món" />
        <el-table-column prop="category" label="Danh mục" />
        <el-table-column prop="price" label="Giá" />
        <el-table-column prop="description" label="Mô tả" />
      </el-table>
    </div>
  </div>

  <el-dialog v-model="openDialog" title="Thêm món ăn" width="600">
    <div class="flex p-2 gap-4">
      <div class="w-[100px] h-[100px]">
        <el-upload
          class="h-full w-full border-dashed border-2 border-gray-300 rounded flex justify-center items-center cursor-pointer"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
        >
          <div class="w-[100px] h-[100px] flex justify-center items-center">
            <i class="fa-solid fa-plus"></i>
          </div>
        </el-upload>
      </div>
      <div class="flex-1">
        <el-form label-width="auto">
          <el-form-item label="Tên món ăn">
            <el-input />
          </el-form-item>

          <el-form-item label="Danh mục">
            <el-select>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Giá">
            <el-input-number controls-position="right" />
          </el-form-item>

          <el-form-item label="Mô tả">
            <el-input :autosize="{ minRows: 4, maxRows: 4 }" :rows="4" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
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

const options = ref([
  { value: 'appetizer', label: 'Khai vị' },
  { value: 'main_course', label: 'Món chính' },
  { value: 'dessert', label: 'Tráng miệng' },
  { value: 'beverage', label: 'Đồ uống' },
])
const foods = ref([])

const openDialog = ref(false)

const addFood = () => {
  openDialog.value = true
}
</script>

<style lang="scss" scoped></style>
