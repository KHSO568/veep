<template>
    <div class="flex h-screen bg-gray-50">
        <!-- Sidebar -->
        <aside class="w-64 bg-veep-beige border-r border-veep-beige-dark flex flex-col">
            <!-- Organization Card -->
            <div class="p-6">
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3 mb-3">
                        <div
                            class="w-10 h-10 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold text-sm">
                            MTN
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm">MTN Bénin</h3>
                            <p class="text-xs text-gray-500">Télécommunication</p>
                        </div>
                    </div>
                    <NuxtLink to="/admin/users/invitations"
                        class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">
                        <span>Revenir en mode Administrateur</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </NuxtLink>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-3 space-y-1">
                <NuxtLink :to="`/admin/organizations/${route.params.id}/events`" :class="[
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
                    route.path.includes('/events') ? 'bg-veep-orange-light text-veep-orange' : 'text-gray-700 hover:bg-veep-beige-dark'
                ]">
                    <div :class="[
                        'w-6 h-6 rounded flex items-center justify-center',
                        route.path.includes('/events') ? 'bg-veep-orange text-white' : 'text-gray-400'
                    ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium">Événements</span>
                </NuxtLink>

                <div
                    class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-veep-beige-dark cursor-pointer">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span class="text-sm font-medium">Cartes</span>
                </div>

                <div
                    class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-veep-beige-dark cursor-pointer">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium">Finances</span>
                </div>

                <div
                    class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-veep-beige-dark cursor-pointer">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span class="text-sm font-medium">Equipe</span>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto flex flex-col">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200 px-8 py-4">
                <div class="flex items-center justify-between">
                    <div class="text-4xl font-Baloo font-bold">
                        <slot name="header">Évènements</slot>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Mode administrateur
                        </div>
                        <div class="flex items-center gap-3 bg-gray-100 rounded-full pl-1 pr-4 py-1">
                            <div
                                class="w-8 h-8 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold text-sm">
                                SA
                            </div>
                            <span class="text-sm font-medium text-gray-700">Sandrine AFOTO</span>
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Banner -->
            <div class="bg-veep-beige/30 py-3 text-center text-sm text-gray-600 border-b border-gray-100">
                Vous êtes connecté en tant qu'<span class="font-bold">administrateur</span>
            </div>

            <!-- Page Content -->
            <div class="p-8 flex-1">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.bg-veep-orange-light {
    background-color: #FFF3E0;
}
</style>
