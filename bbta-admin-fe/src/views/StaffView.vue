<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold mb-4">Danh sách nhân viên</h2>

      <el-button type="primary" @click="openDialogAddStaff()"
        >Thêm nhân viên<i class="fa-solid fa-plus ml-1"></i
      ></el-button>
    </div>

    <div class="p-3">
      <el-table :data="admins" border>
        <el-table-column prop="username" label="Tên đăng nhập" width="120"></el-table-column>
        <el-table-column prop="name" label="Tên" />
        <el-table-column prop="email" label="Email"> </el-table-column>
        <el-table-column prop="phone" label="Số điện thoại"> </el-table-column>
        <el-table-column prop="salary" label="Lương tháng">
          <template #default="scope">
            <span>{{ new Intl.NumberFormat('vi-VN').format(scope.row.salary) }} đ</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="Giới tính">
          <template #default="scope">
            <span>{{ { man: 'Nam', woman: 'Nữ' }[scope.row.sex] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hành động">
          <template #default="scope">
            <el-button type="danger" @click="clickDelete(scope.row._id)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogAddAdmin" title="Thêm người quản lý" width="600">
      <div class="flex p-2 gap-4">
        <div class="flex-1">
          <el-form label-width="auto" :model="form" :rules="rules" ref="formRef">
            <el-form-item label="Tên đăng nhập" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>

            <el-form-item label="Mật khẩu" prop="password">
              <el-input v-model="form.password" type="password" show-password></el-input>
            </el-form-item>

            <el-form-item label="Xác nhận mật khẩu" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" show-password />
            </el-form-item>

            <el-form-item label="Tên">
              <el-input v-model="form.name" />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>

            <el-form-item label="Số điện thoại" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>

            <el-form-item label="Lương tháng" prop="salary">
              <el-input v-model="form.salary" type="number" />
            </el-form-item>

            <el-form-item label="Giới tính" prop="sex">
              <el-select v-model="form.sex">
                <el-option key="man" label="Nam" value="man" />

                <el-option key="woman" label="Nữ" value="woman" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog()">Hủy</el-button>
          <el-button type="primary" @click="addAdmin()">Thêm</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteDialog" title="Xác nhận xóa">
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialog = false">Hủy</el-button>
          <el-button type="danger" @click="deleteApi()">Xác nhận</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElMessage, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'

import { api } from '@/plugin/axios'

const formRef = ref<InstanceType<typeof ElForm>>()
const admins = ref([])

const form = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  salary: 0,
  sex: 'man',
  password: '',
  confirmPassword: '',
})
const dialogAddAdmin = ref(false)

const openDialogAddStaff = () => {
  dialogAddAdmin.value = true
  form.username = ''
  form.name = ''
  form.email = ''
  form.phone = ''
  form.salary = 0
  form.sex = 'man'
  form.password = ''
  form.confirmPassword = ''
}

const closeDialog = () => {
  dialogAddAdmin.value = false
}

const validateEmail = (_rule: any, value: string, callback: (err?: Error) => void) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) {
    return callback()
  }
  if (!regex.test(value)) {
    return callback(new Error('Hãy điền đúng email'))
  }
  callback()
}

const vnPhoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/

const validateVNPhone = (_rule: any, value: string, callback: (err?: Error) => void) => {
  if (!value) {
    return callback()
  }
  if (!vnPhoneRegex.test(value)) {
    return callback(new Error('Số điện thoại không hợp lệ (VN)'))
  }
  callback()
}

const rules: FormRules = {
  username: [{ required: true, message: 'Hãy điền tên đăng nhập' }],
  password: [{ required: true, message: 'Hãy điền mật khẩu' }],
  confirmPassword: [{ required: true, message: 'Hãy điền mật khẩu xác nhận' }],
  email: [{ validator: validateEmail }],
  phone: [{ validator: validateVNPhone }],
}

const addAdmin = async () => {
  const valid = await formRef.value?.validate()

  if (!valid) {
    return
  }

  if (form.password !== form.confirmPassword) {
    ElMessage.error('Mật khẩu và xác nhận mật khẩu không khớp')
    return
  }
  await api.post('/staff', {
    username: form.username,
    name: form.name,
    email: form.email,
    phone: form.phone,
    salary: form.salary,
    sex: form.sex,
    password: form.password,
  })
  await getStaff()
  formRef.value?.resetFields()
  closeDialog()
}

const deleteDialog = ref(false)
const deleteId = ref(null)

const clickDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteApi = async () => {
  await api.delete(`/staff/${deleteId.value}`)

  await getStaff()
  deleteId.value = null
  deleteDialog.value = false
}

const getStaff = async () => {
  const res = await api.get('/staff')
  admins.value = res.data
}

onMounted(async () => {
  await getStaff()
})
</script>

<style scoped></style>
