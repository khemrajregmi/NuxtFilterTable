<script setup lang="ts">
import { NMessageProvider } from 'naive-ui'
</script>

<template>
  <n-message-provider>
    <header>
    </header>
    <main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <footer></footer>
  </n-message-provider>
</template>