<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <div class="flex w-full lg:w-2/5 items-center justify-center p-8 lg:p-12 bg-veep-beige/10 lg:bg-transparent">
      <div class="max-w-sm lg:max-w-2xl w-full flex justify-center">
        <NuxtImg src="/img_orange.webp" alt="VEEP" class="h-32 lg:h-auto w-auto mb-4 lg:mb-8" />
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="w-full max-w-2xl">
        <slot />
      </div>
    </div>
    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup></script>
