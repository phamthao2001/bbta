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

                      <el-button
                        type="warning"
                        class="text-[12px] mt-3"
                        @click="switchTable(serve_ss._id, t_id)"
                      >
                        <i class="fa-solid fa-repeat mr-1"></i> Đổi bàn
                      </el-button>
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

          <el-button type="primary" @click="router.push(`/thanh-toan/${serve_ss._id}`)"
            >Thanh toán</el-button
          >

          <el-button type="danger" @click="cancelServeSession(serve_ss._id)">
            Kết thúc phiên
          </el-button>
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

  <el-dialog v-model="openDialogSwitchTable" title="Chọn bàn để chuyển" width="600">
    <div class="flex justify-center p-2">
      <el-form label-width="auto" style="width: 400px">
        <el-form-item label="Lựa chọn bàn sẽ chuyển tới">
          <el-select v-model="target_table_id" placeholder="Select" style="width: 240px">
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
        <el-button type="primary" @click="confirmSwitch()">Xác nhận chuyển</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="qrcodeShowRef" title="QR Code đăng nhập cho khách hàng">
    <div class="flex justify-center items-center flex-col p-4">
      <qrcode-vue
        :value="qrCodeValue"
        :size="200"
        :level="'M'"
        :bg-color="'#ffffff'"
        :fg-color="'#000000'"
      />

      <div class="mt-4 flex flex-col text-center">
        <div>Hoặc truy cập đường dẫn:</div>
        <a :href="qrCodeValue" target="_blank" class="text-blue-600">{{ qrCodeValue }}</a>
      </div>
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
              <template v-if="o.ordered.length > 0">
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
                            <div class="font-semibold text-sm break-all">
                              {{ item.food_id.name }}
                            </div>
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
          </template>
          <template v-else>
            <div class="flex justify-center text-[14px] py-4">
              Kiểm tra món hủy hoặc thêm món cho bàn này
            </div>
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

        <template v-if="state_order === 'canceled'">
          <template v-for="o in canceled" :key="o._id">
            <template v-if="o.cancelled.length > 0">
              <div
                class="border border-red-400 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
              >
                <div class="text-[12px] px-2 py-1 border-b border-red-400">
                  Mã số đơn: <span class="font-bold">{{ o._id }}</span>
                </div>
                <template v-for="(item, index) in o.cancelled" :key="item._id">
                  <div
                    class="flex justify-between p-2 border-red-400"
                    :class="{
                      'border-b': index < o.cancelled.length - 1,
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
                      <div class="font-medium text-sm text-red-600">Hủy vào lúc</div>
                      <div class="flex justify-end text-[12px]">
                        {{ formatDate(item.time_cancelled) }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </template>

        <template v-if="state_order === 'preparing'">
          <template v-if="hasPreparingItems">
            <template v-for="o in preparing" :key="o._id">
              <template v-if="o.preparing.length > 0">
                <div
                  class="border border-green-400 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
                >
                  <div class="text-[12px] px-2 py-1 border-green-400 border-b">
                    Mã số đơn: <span class="font-bold">{{ o._id }}</span>
                  </div>
                  <template v-if="o.preparing.length > 0">
                    <template v-for="(item, index) in o.preparing" :key="item._id">
                      <div class="text-[12px] px-2 border-b border-green-200">
                        Thời điểm chuẩn bị:
                        <span class="font-bold">{{ formatDate(item.time_started) }}</span>
                      </div>
                      <div
                        class="flex justify-between p-2 border-green-400"
                        :class="{
                          'border-b': index < o.preparing.length - 1,
                        }"
                      >
                        <div class="flex gap-2">
                          <div class="h-[50px] w-[50px]">
                            <img :src="item.food_id.image_url" alt="" />
                          </div>
                          <div>
                            <div class="font-semibold text-sm break-all">
                              {{ item.food_id.name }}
                            </div>
                            <div
                              class="break-all text-[12px] leading-normal font-medium text-[#1c1c1c]"
                            >
                              Số lượng: {{ item.quantity }}
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-col justify-between">
                          <div class="font-medium text-sm text-green-600">Sẵn sàng phục vụ</div>
                          <div class="flex justify-end">
                            <div
                              class="w-4 h-4 bg-green-800 flex justify-center items-center rounded-full cursor-pointer"
                              @click="onAddReady(o._id, item.food_id)"
                            >
                              <i class="fa-solid fa-plus text-white text-[8px]"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            <div class="flex justify-center text-[14px] py-4">
              Kiểm tra món đang xác nhận phục vụ hoặc thêm món cho bàn
            </div>
          </template>
          <div v-if="hasReadyOrder" class="font-bold text-sm text-blue-500">Xác nhận phục vụ</div>
          <template v-for="o in preparing" :key="o._id">
            <template v-if="Object.keys(ready_order).includes(o._id)">
              <div
                class="border border-blue-500 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
              >
                <div class="text-[12px] px-2 py-1">
                  Mã số đơn: <span class="font-bold">{{ o._id }}</span>
                </div>

                <template v-for="(item, index) in ready_order[o._id]" :key="item.food_id">
                  <div
                    class="flex justify-between p-2 border-blue-500"
                    :class="{
                      'border-b': index < ready_order[o._id].length - 1,
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
                        <div
                          class="break-all text-[12px] leading-normal font-medium text-[#1c1c1c]"
                        >
                          Giá: {{ item.price.toLocaleString() }} đ
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col justify-between">
                      <div class="flex justify-end">
                        <div
                          class="w-4 h-4 bg-[red] flex justify-center items-center rounded-full cursor-pointer"
                          @click="removeReady(o._id, item.food_id)"
                        >
                          <i class="fa-solid fa-minus text-white text-[8px]"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </template>

        <template v-if="state_order === 'served'">
          <template v-for="o in served" :key="o._id">
            <template v-if="o.served.length > 0">
              <div
                class="border border-blue-500 rounded bg-white gap-2 shadow-sm hover:shadow-md transition-shadow mb-2"
              >
                <div class="text-[12px] px-2 py-1 border-b border-blue-500">
                  Mã số đơn: <span class="font-bold">{{ o._id }}</span>
                </div>
                <template v-for="(item, index) in o.served" :key="item._id">
                  <div
                    class="flex justify-between p-2 border-blue-500"
                    :class="{
                      'border-b': index < o.served.length - 1,
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
                        <div
                          class="break-all text-[12px] leading-normal font-medium text-[#1c1c1c]"
                        >
                          Giá: {{ item.price.toLocaleString() }} đ
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col justify-between">
                      <div class="font-medium text-sm text-blue-500">Đã phục vụ</div>
                      <div class="font-medium text-sm">{{ item.table_id.name }}</div>
                      <div class="flex justify-end text-[12px]">
                        {{ formatDate(item.time_served) }}
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
            <el-button @click="addFood" type="primary">Thêm món</el-button>

            <el-button v-if="hasOrderItems || hasCanceledOrder" @click="cancelFood" type="primary"
              >Xác nhận chuẩn bị</el-button
            >
          </div>
        </template>

        <template v-if="state_order === 'canceled'">
          <div @click="addFood" class="flex w-full justify-between">
            <el-button type="primary">Thêm món</el-button>
          </div>
        </template>

        <template v-if="state_order === 'preparing'">
          <div @click="addFood" class="flex w-full justify-between">
            <el-button type="primary">Thêm món</el-button>
          </div>

          <el-button v-if="hasReadyOrder" @click="serveFood" type="primary"
            >Xác nhận đã phục vụ</el-button
          >
        </template>

        <template v-if="state_order === 'served'">
          <div @click="addFood" class="flex w-full justify-between">
            <el-button type="primary">Thêm món</el-button>
          </div>
        </template>
      </div>
    </div>
  </el-drawer>

  <el-dialog v-model="showAddFood" :show-close="false" width="700">
    <template #header="{ close, titleId, titleClass }">
      <div class="flex justify-between">
        <h4 :id="titleId" :class="titleClass">
          Thêm món cho
          {{ detailServeSession?.table_ids?.find((i) => i._id === tableIdSession)?.name }}
        </h4>
        <el-button type="danger" @click="close">Hủy</el-button>
      </div>
    </template>
    <div class="h-[50vh] flex flex-col overflow-hidden gap-2">
      <div class="flex-1 overflow-hidden">
        <div class="h-full overflow-auto">
          <template v-for="c in CATEGORIES" :key="c">
            <template v-if="groupedFoods[c]?.length">
              <div class="px-3 py-6 bg-white">
                <h2 class="font-semibold text-lg mb-2 text-2xl">{{ mapLabelCategory[c] }}</h2>
                <div class="flex flex-col">
                  <template v-for="(f, index) in groupedFoods[c]" :key="f._id">
                    <div
                      class="flex border-[#f0efef] pt-4 gap-4"
                      :class="{
                        'border-b pb-4': index !== groupedFoods[c].length - 1,
                      }"
                    >
                      <div class="w-[100px] h-[100px]">
                        <img :src="f.image_url" alt="" class="w-[100px] h-[100px] max-w-[unset]" />
                      </div>

                      <div class="grow">
                        <div
                          class="font-normal break-all text-[1.15rem] w-full leading-normal mb-4"
                        >
                          {{ f.name }}
                        </div>

                        <div
                          class="text-[12px] leading-normal font-normal text-[#acacac] break-all mb-6"
                        >
                          {{ f.description }}
                        </div>

                        <div class="flex justify-between items-center">
                          <div class="text-[16px] leading-normal font-medium text-[#1c1c1c]">
                            {{ f.price.toLocaleString() }} đ
                            <span class="text-[#00b14f]">
                              {{
                                foodIdsInOrder.includes(f._id)
                                  ? `x ${foods.find((i) => i.id === f._id)?.quantity}`
                                  : ''
                              }}
                            </span>
                          </div>

                          <div class="flex gap-2">
                            <div
                              v-if="foodIdsInOrder.includes(f._id)"
                              class="w-8 h-8 bg-[#8a7501] flex justify-center items-center rounded-full cursor-pointer"
                              @click="removeFromCart(f._id)"
                            >
                              <i class="fa-solid fa-minus text-white"></i>
                            </div>

                            <div
                              class="w-8 h-8 bg-[#00b14f] flex justify-center items-center rounded-full cursor-pointer"
                              @click="
                                addToOrder({
                                  id: f._id,
                                  price: f.price,
                                })
                              "
                            >
                              <i class="fa-solid fa-plus text-white"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div v-if="foods.length" class="flex justify-between">
        <div class="text-[16px] font-medium">
          Tổng tiền:
          <span class="text-black font-bold"
            >{{ foods.reduce((s, c) => s + c.quantity * c.price, 0)?.toLocaleString() }} đ</span
          >
        </div>
        <el-button type="primary" @click="addOrder">Thêm đơn</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'

import { URL_CLIENT } from '@/constant'
import { api } from '@/plugin/axios'
import router from '@/router'

const CATEGORIES = [
  'mon_nuong',
  'mon_lau',
  'khai_vi',
  'do_uong',
  'trang_mieng',
  'an_kem',
  'theo_mua',
  'khac',
] as const

const mapLabelCategory: Record<(typeof CATEGORIES)[number], string> = {
  mon_nuong: 'Đồ nướng',
  mon_lau: 'Đồ nhúng lẩu',
  khai_vi: 'Khai vị',
  do_uong: 'Đồ uống',
  trang_mieng: 'Tráng miệng',
  an_kem: 'Ăn kèm',
  theo_mua: 'Theo mùa',
  khac: 'Khác',
}

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

const ready_order = ref({})
const hasPreparingItems = computed(() => {
  return preparing.value.some((o) => o.preparing.length > 0)
})

const preparing = computed(() => {
  let order_section_table = order_session.value.filter(
    (o) => o.table_order_id._id === tableIdSession.value,
  )

  order_section_table = JSON.parse(JSON.stringify(order_section_table))

  const order_ready = Object.keys(ready_order.value)
  order_ready.forEach((order_id) => {
    const orderIndex = order_section_table.findIndex((o) => o._id === order_id)
    if (orderIndex !== -1) {
      const readyItems = ready_order.value[order_id]
      readyItems.forEach((readyItem: any) => {
        const itemIndex = order_section_table[orderIndex].preparing.findIndex(
          (item: any) => item.food_id._id === readyItem.food_id,
        )
        if (itemIndex !== -1) {
          order_section_table[orderIndex].preparing[itemIndex].quantity -= readyItem.quantity
        }
      })
      // Remove items with quantity <= 0
      order_section_table[orderIndex].preparing = order_section_table[orderIndex].preparing.filter(
        (item: any) => item.quantity > 0,
      )
    }
  })

  return order_section_table
})

const hasReadyOrder = computed(() => {
  const preparingIds = preparing.value.map((o) => o._id)
  return preparingIds.some((id) => Object.keys(ready_order.value).includes(id))
})

const onAddReady = (order_id: string, food_id: any) => {
  const existing = ready_order.value[order_id]
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
        price: food_id.price,
      })
    }
  } else {
    ready_order.value[order_id] = [
      {
        food_id: food_id._id,
        quantity: 1,
        name: food_id.name,
        image_url: food_id.image_url,
        price: food_id.price,
      },
    ]
  }
}

const removeReady = (order_id: string, food_id: string) => {
  const existing = ready_order.value[order_id]
  if (existing) {
    const foodIndex = existing.findIndex((item: any) => item.food_id === food_id)
    if (foodIndex !== -1) {
      existing[foodIndex].quantity -= 1
      if (existing[foodIndex].quantity <= 0) {
        existing.splice(foodIndex, 1)
      }
      if (existing.length === 0) {
        delete ready_order.value[order_id]
      }
    }
  }
}

const served = computed(() => {
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
  ready_order.value = {}

  drawerSession.value = true
}

const cancelServeSession = async (serve_session_id: string) => {
  await api.post('/serve-session/end/' + serve_session_id)

  await getTables()
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
  detailServeSession.value = res.data.serve_session
  order_session.value = res.data.order_serve_session
  state_order.value = 'preparing'
  canceled_order.value = {}
  ready_order.value = {}
}

const serveFood = async () => {
  const items = []

  for (const s_id of preparing.value.map((i) => i._id)) {
    const serve = ready_order.value[s_id]

    if (serve && serve.length) {
      items.push({
        order_id: s_id,
        serveItems: serve.map((s) => ({
          food_id: s.food_id,
          quantity: s.quantity,
        })),
      })
    }
  }

  await api.post('/order/serve-food', {
    items,
  })

  // refresh order session
  const res = await api.get('/serve-session/' + detailServeSession.value._id)
  detailServeSession.value = res.data.serve_session
  order_session.value = res.data.order_serve_session
  state_order.value = 'preparing'
  canceled_order.value = {}
  ready_order.value = {}
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

const showAddFood = ref(false)
const foods = ref([])
const groupedFoods = ref({})

const foodIdsInOrder = computed(() => foods.value.map((o) => o.id))

const addFood = async () => {
  const res = await api.get('/food')

  const menu = res.data
  groupedFoods.value = {}
  // group foods by category
  const f = menu.reduce((groups, food) => {
    const category = food.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(food)
    return groups
  }, {})

  groupedFoods.value = f
  foods.value = []
  showAddFood.value = true
}

const addToOrder = (item: { id: string; price: string }) => {
  const existingItem = foods.value.find((orderItem) => orderItem.id === item.id)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    foods.value.push({ ...item, quantity: 1 })
  }
}

const removeFromCart = (id) => {
  const itemIndex = foods.value.findIndex((orderItem) => orderItem.id === id)
  if (itemIndex !== -1) {
    const item = foods.value[itemIndex]!
    if (item.quantity > 1) {
      item.quantity -= 1
    } else {
      foods.value = foods.value.filter((_, index) => index !== itemIndex)
    }
  }
}

const addOrder = async () => {
  if (!foods.value.length) {
    return
  }

  await api.post('/order/create', {
    serve_session_id: detailServeSession.value._id,
    table_order_id: tableIdSession.value,
    ordered: foods.value.map((i) => ({
      food_id: i.id,
      quantity: i.quantity,
      price: i.price,
    })),
  })

  showAddFood.value = false

  const res = await api.get('/serve-session/' + detailServeSession.value._id)
  detailServeSession.value = res.data.serve_session
  order_session.value = res.data.order_serve_session
  state_order.value = 'ordered'
  canceled_order.value = {}
  ready_order.value = {}
}

const openDialogSwitchTable = ref(false)
const ss_id_switch = ref(null)
const table_id_switch = ref(null)
const target_table_id = ref(null)
const switchTable = (ss_id, table_id) => {
  openDialogSwitchTable.value = true
  target_table_id.value = null
  ss_id_switch.value = ss_id
  table_id_switch.value = table_id
}

const confirmSwitch = async () => {
  await api.post('/serve-session/switch-table', {
    serve_session_id: ss_id_switch.value,
    table_id: table_id_switch.value,
    target_table_id: target_table_id.value,
  })

  openDialogSwitchTable.value = false
  target_table_id.value = null
  ss_id_switch.value = null
  table_id_switch.value = null

  await getTables()
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
