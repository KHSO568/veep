<template>
  <div v-if="product" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div class="bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sticky top-0">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-white mb-2">{{ product.name }}</h2>
            <div class="flex flex-wrap gap-4 text-indigo-200">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ formatPrice(product.price) }}
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
            <div v-if="product.image" class="rounded-2xl overflow-hidden border-2 border-gray-700">
              <img :src="product.image" alt="Produit" class="w-full h-64 object-cover" />
            </div>
            
            <div class="bg-gray-900 rounded-2xl p-6 border-2 border-gray-700">
              <h3 class="text-xl font-bold text-white mb-4">Informations</h3>
              <div class="space-y-4">
                <div>
                  <p class="text-gray-400 text-sm">Prix</p>
                  <p class="text-white font-semibold text-2xl">{{ formatPrice(product.price) }}</p>
                </div>
                <div v-if="product.createdAt">
                  <p class="text-gray-400 text-sm">Ajouté le</p>
                  <p class="text-white font-semibold">{{ formatDate(product.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="lg:col-span-2">
            <div class="bg-gray-900 rounded-2xl p-6 border-2 border-gray-700">
              <h3 class="text-xl font-bold text-white mb-4">Description</h3>
              <div class="prose prose-invert max-w-none" v-html="product.description || 'Aucune description disponible'"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  formatPrice: Function
})

defineEmits(['close'])

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

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

</style>
