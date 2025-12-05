<template>
  <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-2xl">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-black text-white tracking-tight">{{ title }}</h1>
            <p class="text-indigo-200 text-sm mt-1">{{ subtitle }}</p>
          </div>
        </div>

        <div class="flex gap-3">
          <NuxtLink v-if="showAdminLink" to="/admin"
            class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all font-semibold border border-white/20">
            🛡️ Admin
          </NuxtLink>
          <NuxtLink to="/"
            class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all font-semibold border border-white/20">
            📅 Événements
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
const isAdmin = computed(() => user.value?.role === 'admin');

defineProps({
  title: { type: String, default: 'ProductHub' },
  subtitle: { type: String, default: 'Gestion intelligente de votre catalogue' },
  showAdminLink: { type: Boolean, default: true }
});
</script>
