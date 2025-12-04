<template>
    <div class="bg-orange-100 py-10">
      <div class="flex justify-between items-center mb-8">
        <div class="text-lg font-semibold">Cartes > Stock</div>
        <div class="flex items-center gap-2">
          <span class="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-sm">SA</span>
          <span class="text-gray-700">{{ userName }}</span>
        </div>
      </div>
  
      <div class="mx-auto max-w-md text-center">
        <img src="/img_shopping.webp" alt="Illustration" class="mx-auto mb-6 w-96 h-96 object-contain" />
        <p class="text-gray-600 mb-4">Créez votre premier Stock de car !</p>
        <button class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md">
          Enregistrer un stock
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const userName = 'Sandrine AFOTO';
  </script>
  
  <style scoped>
  </style>