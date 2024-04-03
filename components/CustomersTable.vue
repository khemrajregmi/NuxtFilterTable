<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { NInput, NDataTable, NTag, NSelect, type DataTableColumns } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface';
import { useCustomers } from '~/composables/customers';

const customers = useCustomers()
const customerData = computed(() => customers.customers.value)
const areCustomersLoading = computed(() => customers.areCustomersLoading.value)

const createColumns = (): DataTableColumns<RowData> => [
  {
    type: 'selection',
  },
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'E-mail',
    key: 'email'
  },
  {
    title: 'Phone number',
    key: 'phone'
  },
  {
    title: 'Status',
    key: 'status',
    render (row) {
      return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: row.status === 'inactive' ? 'error' : 'success',
            class: 'capitalize',
            bordered: false
          },
          {
            default: () => row.status
          }
      )
    }
  }
]

const columns = createColumns()

const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const filters = reactive({
  name: null,
  email: null,
  status: null,
})

watchDebounced(
    filters,
    async () => {
      await customers.getCustomers({
        page: 1,
        pageSize: pagination.pageSize,
        filters
      })

      pagination.page = 1
      pagination.pageCount = customerData.value.last_page
      pagination.pageSize = customerData.value.per_page
    },
    { debounce: 500, maxWait: 1000 },
)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  pageCount: customerData.value.last_page,
  showSizePicker: true,
  pageSizes: [3, 5, 7, 10, 15, 20],
  onChange: async(_page: number) => {
    pagination.page = _page
    await customers.getCustomers({
      page: _page,
      pageSize: pagination.pageSize,
      filters
    })
  },
  onPageSizeChange: async(_pageSize: number) => {
    pagination.pageSize = _pageSize
    pagination.page = 1
    await customers.getCustomers({
      page: pagination.page,
      pageSize: _pageSize,
      filters
    })
    pagination.pageCount = customerData.value.last_page
  },
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="font-semibold text-lg mb-2">Filters</h2>
      <div class="flex items-start gap-4">
        <div class="flex-1">
          <p>Customers name:</p>
          <n-input clearable v-model:value="filters.name" />
        </div>
        <div class="flex-1">
          <p>E-mail</p>
          <n-input clearable v-model:value="filters.email" />
        </div>
        <div class="flex-1">
          <p>Status</p>
          <n-select clearable v-model:value="filters.status" :options="statuses" />
        </div>
      </div>
    </div>
    <n-data-table
        remote
        :columns="columns"
        :data="customerData.data"
        :pagination="pagination"
        :loading="areCustomersLoading"
    />
  </div>
</template>
