<template>
  <div class="max-w-2xl">
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-gray-900 mb-6">Informations du profil</h2>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" :value="user?.email" disabled
            class="w-full bg-gray-50 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg cursor-not-allowed" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'affichage</label>
          <input :value="displayName" @input="$emit('update:displayName', $event.target.value)" type="text" placeholder="Votre nom"
            class="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
          <div class="flex items-center gap-2">
            <UserRoleBadge :role="user?.role" />
          </div>
        </div>

        <div class="pt-4">
          <button @click="$emit('save')" :disabled="saving"
            class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2">
            <span v-if="saving"
              class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ saving ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
  displayName: String,
  saving: Boolean
});

defineEmits(['save', 'update:displayName']);
</script>
