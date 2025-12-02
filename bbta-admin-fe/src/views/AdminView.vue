<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold mb-4">Danh sách người quản lý</h2>

      <el-button type="primary" @click="openDialogAddAdmin()"
        >Thêm người quản lý<i class="fa-solid fa-plus ml-1"></i
      ></el-button>
    </div>

    <div class="p-3">
      <el-table :data="admins" border>
        <el-table-column prop="username" label="Tên đăng nhập" width="120"></el-table-column>
        <el-table-column prop="name" label="Tên" />
        <el-table-column prop="email" label="Email"> </el-table-column>
        <el-table-column prop="phone" label="Số điện thoại"> </el-table-column>
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
          <el-form label-width="auto" :model="formAdmin" :rules="rules" ref="formRef">
            <el-form-item label="Tên đăng nhập" prop="username">
              <el-input v-model="formAdmin.username" />
            </el-form-item>

            <el-form-item label="Mật khẩu" prop="password">
              <el-input v-model="formAdmin.password" type="password" show-password></el-input>
            </el-form-item>

            <el-form-item label="Xác nhận mật khẩu" prop="confirmPassword">
              <el-input v-model="formAdmin.confirmPassword" type="password" show-password />
            </el-form-item>

            <el-form-item label="Tên">
              <el-input v-model="formAdmin.name" />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="formAdmin.email" />
            </el-form-item>

            <el-form-item label="Số điện thoại" prop="phone">
              <el-input v-model="formAdmin.phone" />
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

    <el-dialog v-model="deleteAdmin" title="Xác nhận xóa">
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteAdmin = false">Hủy</el-button>
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

const formAdmin = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})
const dialogAddAdmin = ref(false)

const openDialogAddAdmin = () => {
  dialogAddAdmin.value = true
  formAdmin.username = ''
  formAdmin.name = ''
  formAdmin.email = ''
  formAdmin.phone = ''
  formAdmin.password = ''
  formAdmin.confirmPassword = ''
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

  if (formAdmin.password !== formAdmin.confirmPassword) {
    ElMessage.error('Mật khẩu và xác nhận mật khẩu không khớp')
    return
  }
  await api.post('/admin', {
    username: formAdmin.username,
    name: formAdmin.name,
    email: formAdmin.email,
    phone: formAdmin.phone,
    password: formAdmin.password,
  })
  await getAdmin()
  formRef.value?.resetFields()
  closeDialog()
}

const deleteAdmin = ref(false)
const deleteAdminId = ref(null)

const clickDelete = (id) => {
  deleteAdminId.value = id
  deleteAdmin.value = true
}

const deleteApi = async () => {
  await api.delete(`/admin/${deleteAdminId.value}`)

  await getAdmin()
  deleteAdminId.value = null
  deleteAdmin.value = false
}

const getAdmin = async () => {
  const res = await api.get('/admin')
  admins.value = res.data
}

onMounted(() => {
  getAdmin()
})
</script>

<style scoped></style>
