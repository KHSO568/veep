<template>
  <div>
    <NuxtPage />
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { setToastInstance } from '~/composables/useToast';

const toastRef = ref(null);

onMounted(() => {
  if (toastRef.value) {
    setToastInstance(toastRef.value);
  }
});
</script>
