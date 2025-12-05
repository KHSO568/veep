<template>
  <div v-if="message" :class="[
    'fixed top-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white z-50 backdrop-blur-xl border-2 transition-all duration-300',
    type === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-rose-500/90 border-rose-400',
    'animate-toast'
  ]">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <span class="text-xl">{{ type === 'success' ? '✓' : '✗' }}</span>
      </div>
      <span class="font-semibold">{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: String,
  type: { type: String, default: 'success' }
});
</script>

<style scoped>
@keyframes toast {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-toast {
  animation: toast 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
