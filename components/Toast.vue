<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="[
          'flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border',
          'transform transition-all duration-300',
          toastStyles[toast.type]
        ]">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 pt-0.5">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>

          <!-- Close button -->
          <button @click="removeToast(toast.id)" class="flex-shrink-0 hover:opacity-70 transition-opacity">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const toastStyles = {
  success: 'bg-green-50/90 border-green-200 text-green-800',
  error: 'bg-red-50/90 border-red-200 text-red-800',
  warning: 'bg-orange-50/90 border-orange-200 text-orange-800',
  info: 'bg-blue-50/90 border-blue-200 text-blue-800'
};

const addToast = (toast) => {
  const id = Date.now() + Math.random();
  const newToast = { ...toast, id };
  toasts.value.push(newToast);

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id);
  }, toast.duration || 4000);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Expose methods for use by composable
defineExpose({
  addToast,
  removeToast
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
