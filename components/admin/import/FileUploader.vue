<template>
  <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 mb-6">1. Télécharger votre fichier</h2>

    <div class="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
      <div class="flex items-start gap-4">
        <div class="p-2 bg-blue-100 rounded-lg">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-blue-900 text-sm">Téléchargez le modèle</h3>
          <p class="text-blue-700 text-sm mt-1 mb-4">
            Utilisez notre modèle CSV/Excel pour formater correctement vos données. Colonnes requises: email,
            displayName, role
          </p>
          <button @click="$emit('download-template')"
            class="text-blue-700 hover:text-blue-800 text-sm font-medium underline">
            Télécharger le modèle CSV
          </button>
        </div>
      </div>
    </div>

    <div @drop.prevent="handleDrop" @dragover.prevent @dragenter="dragging = true" @dragleave="dragging = false" :class="[
      'border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer',
      dragging ? 'border-veep-orange bg-orange-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    ]" @click="$refs.fileInput.click()">
      <input ref="fileInput" type="file" accept=".csv,.xlsx,.xls" @change="handleFileSelect" class="hidden" />

      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <p class="text-lg font-medium text-gray-900 mb-1">Glissez-déposez votre fichier ici</p>
      <p class="text-sm text-gray-500">ou cliquez pour sélectionner un fichier (CSV, Excel)</p>

      <div v-if="file"
        class="mt-6 inline-flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <span class="font-medium text-gray-900 text-sm">{{ file.name }}</span>
        <button @click.stop="$emit('clear-file')" class="text-gray-400 hover:text-red-500 ml-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <button @click="$emit('parse')" :disabled="!file || parsing"
        class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2">
        <span v-if="parsing"
          class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
        {{ parsing ? "Analyse en cours..." : "Continuer" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  file: Object,
  parsing: Boolean
});

const emit = defineEmits(['download-template', 'file-selected', 'clear-file', 'parse']);

const dragging = ref(false);
const fileInput = ref(null);

const handleDrop = (e) => {
  dragging.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) emit('file-selected', files[0]);
};

const handleFileSelect = (e) => {
  const files = e.target.files;
  if (files.length > 0) emit('file-selected', files[0]);
};
</script>
