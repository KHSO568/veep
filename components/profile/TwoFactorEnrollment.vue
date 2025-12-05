<template>
  <div class="space-y-6">
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        <div>
          <h3 class="font-semibold text-amber-800 text-sm">Gardez vos codes de sauvegarde en sécurité</h3>
          <p class="text-amber-700 text-sm mt-1">
            Vous aurez besoin de ces codes si vous perdez l'accès à votre appareil d'authentification.
          </p>
        </div>
      </div>
    </div>

    <div class="text-center border-b border-gray-100 pb-6">
      <h3 class="text-base font-semibold text-gray-900 mb-2">1. Scannez ce code QR</h3>
      <p class="text-gray-500 text-sm mb-4">Utilisez une application comme Google Authenticator ou Authy</p>
      <div v-if="qrCodeUrl" class="inline-block bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <img :src="qrCodeUrl" alt="QR Code" class="w-48 h-48" />
      </div>
      <p class="text-sm text-gray-500 mt-4">
        Ou entrez manuellement : <code class="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono text-xs">{{ secret
        }}</code>
      </p>
    </div>

    <div class="border-b border-gray-100 pb-6">
      <h3 class="text-base font-semibold text-gray-900 mb-4">2. Sauvegardez vos codes de récupération</h3>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-3">
        <div v-for="(code, index) in backupCodes" :key="index"
          class="font-mono text-center text-sm text-gray-600 bg-white border border-gray-100 py-1.5 rounded">
          {{ code }}
        </div>
      </div>
      <button @click="$emit('download-codes')"
        class="mt-4 text-veep-orange hover:text-veep-orange-dark text-sm font-medium flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Télécharger les codes
      </button>
    </div>

    <div>
      <h3 class="text-base font-semibold text-gray-900 mb-4">3. Vérifiez votre configuration</h3>
      <p class="text-gray-500 text-sm mb-4">Entrez le code de votre application d'authentification :</p>
      <input :value="verificationCode" @input="$emit('update:verificationCode', $event.target.value)" type="text"
        placeholder="000000" maxlength="6"
        class="w-full max-w-xs bg-white border border-gray-300 text-gray-900 text-center text-2xl tracking-widest p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent font-mono" />
    </div>

    <div class="flex gap-3 pt-4">
      <button @click="$emit('cancel')"
        class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
        Annuler
      </button>
      <button @click="$emit('complete')" :disabled="!verificationCode || verificationCode.length !== 6"
        class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50">
        Activer 2FA
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  qrCodeUrl: String,
  secret: String,
  backupCodes: Array,
  verificationCode: String
});

defineEmits(['download-codes', 'update:verificationCode', 'cancel', 'complete']);
</script>
