<template>
  <div class="max-w-3xl space-y-6">
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Authentification à deux facteurs (2FA)</h2>
          <p class="text-gray-500 text-sm mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
        </div>
        <div v-if="twoFactorStatus?.enabled"
          class="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          Activé
        </div>
        <div v-else class="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font- medium">
          Désactivé
        </div>
      </div>

      <!-- Not Enrolled -->
      <div v-if="!twoFactorStatus?.enabled && !enrolling">
        <p class="text-gray-600 mb-6">
          L'authentification à deux facteurs n'est pas encore activée sur votre compte. Cliquez ci-dessous pour commencer
          l'inscription.
        </p>
        <button @click="$emit('start-enrollment')"
          class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium">
          Activer 2FA
        </button>
      </div>

      <slot name="enrollment"></slot>

      <!-- Enrolled -->
      <div v-if="twoFactorStatus?.enabled && !enrolling">
        <p class="text-gray-600 mb-6">Votre compte est protégé par l'authentification à deux facteurs.</p>
        <div class="flex gap-3">
          <button @click="$emit('regenerate-codes')"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
            Régénérer codes de sauvegarde
          </button>
          <button @click="$emit('disable')"
            class="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-sm font-medium">
            Désactiver 2FA
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
      <p class="text-gray-500 text-sm mb-6">Utilisez la fonctionnalité de réinitialisation du mot de passe de Firebase.</p>
      <button @click="$emit('reset-password')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
        Envoyer un email de réinitialisation
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  twoFactorStatus: Object,
  enrolling: Boolean
});

defineEmits(['start-enrollment', 'regenerate-codes', 'disable', 'reset-password']);
</script>
