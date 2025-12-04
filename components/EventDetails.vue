<template>
  <div v-if="event" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div class="bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sticky top-0">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-white mb-2">{{ event.name }}</h2>
            <div class="flex flex-wrap gap-4 text-indigo-200">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ event.location }}
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ formatDate(event.startTime) }}
              </div>
            </div>
          </div>
          <button @click="$emit('close')" class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Image et informations -->
          <div class="lg:col-span-1 space-y-6">
            <div v-if="event.image" class="rounded-2xl overflow-hidden border-2 border-gray-700">
              <img :src="event.image" alt="Événement" class="w-full h-64 object-cover" />
            </div>
            
            <div class="bg-gray-900 rounded-2xl p-6 border-2 border-gray-700">
              <h3 class="text-xl font-bold text-white mb-4">Informations</h3>
              <div class="space-y-4">
                <div>
                  <p class="text-gray-400 text-sm">Lieu</p>
                  <p class="text-white font-semibold">{{ event.location }}</p>
                </div>
                <div>
                  <p class="text-gray-400 text-sm">Début</p>
                  <p class="text-white font-semibold">{{ formatDateTime(event.startTime) }}</p>
                </div>
                <div>
                  <p class="text-gray-400 text-sm">Fin</p>
                  <p class="text-white font-semibold">{{ formatDateTime(event.endTime) }}</p>
                </div>
                <div>
                  <p class="text-gray-400 text-sm">Organisateur</p>
                  <p class="text-white font-semibold">{{ event.userEmail }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="lg:col-span-2">
            <div class="bg-gray-900 rounded-2xl p-6 border-2 border-gray-700">
              <h3 class="text-xl font-bold text-white mb-4">Description</h3>
              <div class="prose prose-invert max-w-none" v-html="event.description || 'Aucune description disponible'"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: Object,
  formatDate: Function,
  formatDateTime: Function
})

defineEmits(['close'])
</script>
<!-- 
<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.prose :deep(h1) {
  @apply text-2xl font-bold text-white mb-4;
}
.prose :deep(h2) {
  @apply text-xl font-bold text-white mb-3;
}
.prose :deep(h3) {
  @apply text-lg font-bold text-white mb-2;
}
.prose :deep(p) {
  @apply text-gray-300 mb-4;
}
.prose :deep(ul) {
  @apply text-gray-300 list-disc list-inside mb-4;
}
.prose :deep(ol) {
  @apply text-gray-300 list-decimal list-inside mb-4;
}
.prose :deep(li) {
  @apply mb-1;
}
.prose :deep(strong) {
  @apply text-white font-semibold;
}
.prose :deep(em) {
  @apply text-gray-400 italic;
}
</style> -->