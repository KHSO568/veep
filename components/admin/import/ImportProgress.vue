<template>
  <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 mb-6">3. Importation en cours</h2>

    <div class="space-y-6">
      <div class="bg-gray-50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Progression</span>
          <span class="text-sm text-gray-500">{{ imported }} / {{ total }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div :style="{ width: (imported / total) * 100 + '%' }"
            class="bg-veep-orange h-full transition-all duration-300 rounded-full"></div>
        </div>
      </div>

      <div v-if="!importing && imported === total"
        class="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-green-800 mb-1">Import terminé !</h3>
        <p class="text-green-600 text-sm">{{ imported }} utilisateur(s) importé(s) avec succès</p>
      </div>

      <div v-if="importErrors.length > 0" class="bg-red-50 border border-red-100 rounded-lg p-6">
        <h3 class="font-semibold text-red-800 text-sm mb-3">Erreurs d'importation</h3>
        <ul class="space-y-1 max-h-40 overflow-y-auto">
          <li v-for="(error, index) in importErrors" :key="index" class="text-red-600 text-xs">{{ error }}</li>
        </ul>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <NuxtLink to="/admin/users"
        class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium">
        Voir les utilisateurs
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imported: Number,
  total: Number,
  importing: Boolean,
  importErrors: { type: Array, default: () => [] }
});
</script>
