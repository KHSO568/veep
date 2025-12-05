<template>
  <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 mb-6">2. Vérifier et valider les données</h2>

    <div v-if="errors.length > 0" class="mb-6">
      <div class="bg-red-50 border border-red-100 rounded-lg p-4">
        <h3 class="font-semibold text-red-800 text-sm mb-2">{{ errors.length }} erreur(s) détectée(s)</h3>
        <ul class="space-y-1">
          <li v-for="(error, index) in errors.slice(0, 5)" :key="index"
            class="text-red-600 text-sm flex items-start gap-2">
            <span class="text-red-400">•</span>
            <span>{{ error }}</span>
          </li>
        </ul>
        <p v-if="errors.length > 5" class="text-red-500 text-xs mt-2 pl-3">
          et {{ errors.length - 5 }} autres erreurs...
        </p>
      </div>
    </div>

    <div class="border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ligne</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(row, index) in previewData" :key="index" :class="row.valid ? '' : 'bg-red-50'">
              <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ row.email }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ row.displayName }}</td>
              <td class="px-4 py-3">
                <UserRoleBadge :role="row.role" />
              </td>
              <td class="px-4 py-3">
                <span v-if="row.valid" class="text-green-600 text-xs font-medium flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  Valide
                </span>
                <span v-else class="text-red-600 text-xs font-medium">{{ row.error }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 mb-8">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ previewData.length }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wide">Total</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ validCount }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wide">Valides</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-600">{{ previewData.length - validCount }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wide">Invalides</div>
        </div>
      </div>
    </div>

    <div class="flex gap-3 justify-end">
      <button @click="$emit('back')"
        class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
        Retour
      </button>
      <button @click="$emit('import')" :disabled="validCount === 0"
        class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50">
        Importer {{ validCount }} utilisateur(s)
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  previewData: { type: Array, default: () => [] },
  errors: { type: Array, default: () => [] },
  validCount: Number
});

defineEmits(['back', 'import']);
</script>
