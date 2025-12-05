<template>
  <div class="flex min-h-screen">
    <div class="hidden lg:flex lg:w-2/5 items-center justify-center p-12">
      <div class="max-w-2xl">
        <NuxtImg src="/img_orange.webp" alt="VEEP" class="h-auto w-auto mb-8" />
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-2xl">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup></script>
