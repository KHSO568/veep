<template>
    <div class="flex min-h-screen">
        <!-- Left Side - Gradient Background -->
        <div
            class="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-orange-400 to-orange-200 items-center justify-center p-12">
            <div class="max-w-md">
                <NuxtImg src="/Vector.webp" alt="VEEP" class="h-12 w-auto mb-8" />
            </div>
        </div>

        <!-- Right Side - Form Content -->
        <div class="flex-1 flex items-center justify-center p-8 bg-white">
            <div class="w-full max-w-md">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
// Auth layout for login, register, forgot password, etc.
</script>
