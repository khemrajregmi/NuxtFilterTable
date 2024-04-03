<script lang="ts" setup>
import { useCustomers } from '~/composables/customers';

const customers = useCustomers()

await useAsyncData('customers', async () => {
  await customers.getCustomers({
    page: 1,
    pageSize: 10,
  })
})
</script>

<template>
  <div class="pb-16 pt-8 px-8 mx-auto w-full max-w-screen-xl">
    <h1 class="font-bold text-4xl mb-4">Customers data</h1>
    <ClientOnly>
      <customers-table />
    </ClientOnly>
  </div>
</template>