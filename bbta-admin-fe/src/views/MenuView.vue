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
        <el-table-column prop="image_url" label="Ảnh minh họa" width="120">
          <template #default="scope">
            <img
              v-if="scope.row.image_url"
              :src="scope.row.image_url"
              alt=""
              class="w-16 h-16 object-cover"
            />
            <img v-else src="@/assets/img/dish.png" alt="" class="w-16 h-16 object-cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên món" />
        <el-table-column prop="category" label="Danh mục">
          <template #default="scope">
            <span>{{ options.find((option) => option.value === scope.row.category)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="Giá">
          <template #default="scope">
            <span>{{ formatPrice(scope.row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Mô tả" />
      </el-table>
    </div>
  </div>

  <el-dialog v-model="openDialog" title="Thêm món ăn" width="600">
    <div class="flex p-2 gap-4">
      <div class="w-[100px] h-[100px]">
        <div
          class="h-full w-full border-dashed border-2 border-gray-300 rounded flex justify-center items-center cursor-pointer"
          @click="inputRef?.click()"
        >
          <div class="w-[100px] h-[100px] flex justify-center items-center">
            <img v-if="fileContent" :src="fileContent" alt="" />
            <i v-else class="fa-solid fa-plus"></i>
          </div>
          <input ref="inputRef" hidden type="file" @change="onChangeFile" />
        </div>
      </div>
      <div class="flex-1">
        <el-form label-width="auto">
          <el-form-item label="Tên món ăn">
            <el-input v-model="formFood.name" />
          </el-form-item>

          <el-form-item label="Danh mục">
            <el-select v-model="formFood.category">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Giá">
            <el-input-number v-model="formFood.price" controls-position="right" />
          </el-form-item>

          <el-form-item label="Mô tả">
            <el-input
              v-model="formFood.description"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :rows="4"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog()">Hủy</el-button>
        <el-button type="primary" @click="createFood()">Thêm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'

import { api } from '@/plugin/axios'
import { CATEGORIES } from '@/utils/const'

const inputRef = ref<HTMLInputElement | null>(null)

const options = ref([
  { value: CATEGORIES[0], label: 'Đồ nướng' },
  { value: CATEGORIES[1], label: 'Đồ nhúng lẩu' },
  { value: CATEGORIES[2], label: 'Khai vị' },
  { value: CATEGORIES[3], label: 'Đồ uống' },
  { value: CATEGORIES[4], label: 'Tráng miệng' },
  { value: CATEGORIES[5], label: 'Ăn kèm' },
  { value: CATEGORIES[6], label: 'Theo mùa' },
  { value: CATEGORIES[7], label: 'Khác' },
])
const foods = ref([])

const openDialog = ref(false)

const formFood = reactive({
  name: '',
  category: '',
  price: '',
  description: '',
  image_url: '',
})

function formatPrice(price: number | string | undefined | null) {
  const n = Number(price) || 0
  // 'vi-VN' uses dot as thousand separator, which matches the design
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

const getAllFoods = async () => {
  const res = await api.get('/food')
  foods.value = res.data
}

onMounted(() => {
  getAllFoods()
})

const addFood = () => {
  openDialog.value = true
}

const fileContent = ref<string | null>(null)
const onChangeFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      fileContent.value = imageUrl
    }
    reader.readAsDataURL(file)
  }
}

const createFood = async () => {
  if (fileContent.value) {
    const formData = new FormData()
    formData.append('file', fileContent.value as string)
    formData.append('upload_preset', 'unsigned')

    const res = await axios({
      method: 'post',
      url: 'https://api.cloudinary.com/v1_1/dgsupjj9u/image/upload',
      data: formData,
    })

    const imageUrl = res.data.secure_url
    formFood.image_url = imageUrl
  }

  // call api to create food
  await api.post('/food', formFood)

  closeDialog()
  getAllFoods()
}

const closeDialog = () => {
  openDialog.value = false
  formFood.name = ''
  formFood.category = ''
  formFood.price = ''
  formFood.description = ''
  formFood.image_url = ''
  fileContent.value = null
}
</script>

<style lang="scss" scoped></style>
