<template>
  <div class="max-w-3xl">
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-gray-900 mb-6">Sessions actives</h2>
      <div class="space-y-4">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="font-medium text-gray-900">Session actuelle</div>
              <div class="text-sm text-gray-500">{{ deviceInfo }}</div>
              <div class="text-xs text-gray-400 mt-0.5">Expire dans: {{ timeRemaining }}</div>
            </div>
          </div>
          <span class="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Actif</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  deviceInfo: String,
  timeRemaining: String
});
</script>
