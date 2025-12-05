<template>
  <div class="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700 sticky top-8">
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ editMode ? "Modification" : "Nouveau produit" }}
      </h2>
    </div>

    <div class="p-6 space-y-5">
      <div>
        <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Nom</label>
        <input
          :value="name"
          @input="$emit('update:name', $event.target.value)"
          type="text"
          placeholder="MacBook Pro 16"
          class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none placeholder-gray-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Prix</label>
        <div class="relative">
          <input
            :value="price"
            @input="$emit('update:price', Number($event.target.value))"
            type="number"
            step="0.01"
            placeholder="2499.99"
            class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 pr-12 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none placeholder-gray-500"
            required
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Description</label>
        <client-only>
          <AiEditor :modelValue="description" @update:modelValue="$emit('update:description', $event)" />
        </client-only>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Image</label>
        <button
          type="button"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all font-bold flex items-center justify-center gap-3 shadow-lg"
          @click="$emit('clickImageUpload')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Choisir une image
        </button>

        <div v-if="imagePreview" class="mt-4 relative group">
          <img :src="imagePreview" alt="Aperçu" class="w-full h-56 rounded-2xl object-cover border-4 border-gray-700 shadow-lg" />
          <button
            type="button"
            @click="$emit('clearImage')"
            class="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-full transition-all shadow-lg opacity-0 group-hover:opacity-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="pt-4 space-y-3">
        <button
          @click="$emit('submit')"
          :disabled="!isFormValid"
          class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-teal-600"
        >
          {{ editMode ? "💾 Enregistrer" : "✨ Créer le produit" }}
        </button>

        <button
          v-if="editMode"
          @click="$emit('cancel')"
          class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all font-semibold"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: String,
  price: Number,
  description: String,
  imagePreview: String,
  editMode: Boolean
});

defineEmits(['update:name', 'update:price', 'update:description', 'clickImageUpload', 'clearImage', 'submit', 'cancel']);

const isFormValid = computed(() => props.name?.trim() !== '' && props.price !== null);
</script>
