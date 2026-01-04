<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold mb-4">Danh sách khách hàng</h2>

      <el-button type="primary" @click="openDialogAddCustomer()"
        >Thêm khách hàng<i class="fa-solid fa-plus ml-1"></i
      ></el-button>
    </div>

    <div class="p-3">
      <el-table :data="admins" border>
        <el-table-column prop="phone" label="Số điện thoại"> </el-table-column>
        <el-table-column prop="name" label="Tên" />
        <el-table-column prop="sex" label="Giới tính">
          <template #default="scope">
            <span>{{ { man: 'Nam', woman: 'Nữ' }[scope.row.sex] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="Ngày sinh">
          <template #default="scope">
            <span>{{
              scope.row.birthday ? new Date(scope.row.birthday).toISOString().slice(0, 10) : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hành động">
          <template #default="scope">
            <el-button type="danger" @click="clickDelete(scope.row._id)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogAddAdmin" title="Thêm khách hàng" width="600">
      <div class="flex p-2 gap-4">
        <div class="flex-1">
          <el-form label-width="auto" :model="form" :rules="rules" ref="formRef">
            <el-form-item label="Số điện thoại" prop="phone" required>
              <el-input v-model="form.phone" />
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

            <el-form-item label="Giới tính" prop="sex">
              <el-select v-model="form.sex">
                <el-option key="man" label="Nam" value="man" />

                <el-option key="woman" label="Nữ" value="woman" />
              </el-select>
            </el-form-item>

            <el-form-item label="Ngày sinh" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="Chọn ngày"
                clearable
              />
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
  phone: '',
  name: '',
  sex: 'man',
  birthday: '',
  password: '',
  confirmPassword: '',
})
const dialogAddAdmin = ref(false)

const openDialogAddCustomer = () => {
  dialogAddAdmin.value = true
  form.name = ''
  form.phone = ''
  form.sex = 'man'
  form.birthday = ''
  form.password = ''
  form.confirmPassword = ''
}

const closeDialog = () => {
  dialogAddAdmin.value = false
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
  password: [{ required: true, message: 'Hãy điền mật khẩu' }],
  confirmPassword: [{ required: true, message: 'Hãy điền mật khẩu xác nhận' }],
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

  const utcTime = form.birthday

  const date = new Date(utcTime)

  date.setHours(date.getHours() + 7)

  await api.post('/customer', {
    name: form.name,
    phone: form.phone,
    sex: form.sex,
    password: form.password,
    birthday: date.toISOString(),
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
  await api.delete(`/customer/${deleteId.value}`)

  await getStaff()
  deleteId.value = null
  deleteDialog.value = false
}

const getStaff = async () => {
  const res = await api.get('/customer')
  admins.value = res.data
}

onMounted(async () => {
  await getStaff()
})
</script>

<style scoped></style>
