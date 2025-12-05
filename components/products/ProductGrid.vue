<template>
  <div class="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700">
    <div class="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-8-8 8m16 0l-8 8-8-8" />
            </svg>
            Catalogue
          </h2>
          <p class="text-indigo-200 mt-2 font-semibold">
            {{ products.length }} produit(s) disponible(s)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <input
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              type="text"
              placeholder="Rechercher..."
              class="w-64 bg-white/10 border-2 border-white/20 text-white placeholder-indigo-200 p-3 pl-11 rounded-xl focus:border-white focus:bg-white/20 transition-all outline-none"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-200" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button v-if="selectedProducts.length > 0" @click="$emit('deleteMultiple')"
            class="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-5 py-3 rounded-xl transition-all font-bold shadow-lg flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer ({{ selectedProducts.length }})
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="p in filteredProducts" :key="p.id" @click="$emit('select', p)"
          class="group bg-gray-900 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:border-indigo-500 hover:shadow-2xl"
          :class="selectedProducts.includes(p.id) ? 'border-indigo-500 shadow-xl shadow-indigo-500/20' : 'border-gray-700'">
          <div class="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900">
            <div v-if="canManageProduct(p)" class="absolute top-3 left-3 z-10">
              <input type="checkbox" :checked="selectedProducts.includes(p.id)"
                @click.stop="$emit('toggleSelect', p.id)"
                class="w-6 h-6 rounded-lg bg-gray-900/50 border-2 border-white/30 checked:bg-indigo-600 transition-all cursor-pointer" />
            </div>

            <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
              <svg class="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="p-5">
            <h3 class="text-xl font-bold text-white mb-3 truncate">{{ p.name }}</h3>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatPrice(p.price) }}
              </div>
            </div>

            <div v-if="canManageProduct(p)" class="flex flex-col gap-2 mt-4">
              <button @click.stop="$emit('edit', p)"
                class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              <button @click.stop="$emit('delete', p)"
                class="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div
          class="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-700">
          <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-400 mb-2">Aucun produit</h3>
        <p class="text-gray-500">Créez votre premier produit pour commencer</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  products: { type: Array, required: true },
  selectedProducts: { type: Array, default: () => [] },
  searchQuery: { type: String, default: '' },
  formatPrice: { type: Function, required: true },
  canManageProduct: { type: Function, required: true }
});

const emit = defineEmits(['update:searchQuery', 'select', 'edit', 'delete', 'deleteMultiple', 'toggleSelect']);

const filteredProducts = computed(() => {
  if (!props.searchQuery.trim()) return props.products;
  return props.products.filter(p =>
    p.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});
</script>
