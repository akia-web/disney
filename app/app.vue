<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster/>
</template>
<script lang="ts" setup>

const auth = useAuthStore()
await auth.fetchUser()
</script>
