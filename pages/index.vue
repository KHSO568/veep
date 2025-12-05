<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <p>Redirection...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

definePageMeta({
  middleware: ['auth']
})

onMounted(() => {
  const { user } = useAuth()
  if (user.value) {
    navigateTo('/admin')
  } else {
    navigateTo('/auth/login')
  }
})
</script>
