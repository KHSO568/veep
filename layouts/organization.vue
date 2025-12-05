<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
            class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"></div>
        
        <aside :class="[
            'fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-veep-beige dark:bg-gray-900 border-r border-veep-beige-dark dark:border-gray-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <div class="p-4 sm:p-6 flex-shrink-0">
                <div class="flex justify-end lg:hidden mb-2">
                    <button @click="isMobileMenuOpen = false"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-2 -mr-2">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center gap-2 sm:gap-3 mb-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                            MTN
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm truncate">MTN Bénin</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Télécommunication</p>
                        </div>
                    </div>
                    <NuxtLink :to="`/admin/users/invitations`"
                        class="w-full flex items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors">
                        <span class="hidden sm:inline">Revenir en mode Administrateur</span>
                        <span class="sm:hidden">Mode Admin</span>
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </NuxtLink>
                </div>
            </div>
            
            <nav class="flex-1 px-2 sm:px-3 space-y-1 overflow-y-auto pb-4">
                <NuxtLink :to="`/admin/organizations/${route.params.id}/events`" @click="isMobileMenuOpen = false"
                    :class="[
                        'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg transition-all font-medium',
                        route.path.includes('/events') ? 'bg-veep-orange-light text-veep-orange' : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800'
                    ]">
                    <div :class="[
                        'w-6 h-6 rounded flex items-center justify-center flex-shrink-0',
                        route.path.includes('/events') ? 'bg-veep-orange text-white' : 'text-gray-400'
                    ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium">Événements</span>
                </NuxtLink>
                
                <div class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800 cursor-pointer">
                    <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium">Cartes</span>
                </div>
                
                <div class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800 cursor-pointer">
                    <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium">Finances</span>
                </div>
                
                <div class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800 cursor-pointer">
                    <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium">Equipe</span>
                </div>
            </nav>
        </aside>
        
        <main class="flex-1 overflow-auto flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-10">
                <div class="flex items-center justify-between gap-2 sm:gap-4">
                    <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <button @click="isMobileMenuOpen = true"
                            class="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 -ml-2">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-Baloo font-bold text-gray-900 dark:text-white truncate">
                            <slot name="header">Évènements</slot>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                        <ThemeToggle />
                        
                        <div class="bg-teal-500 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hidden md:flex items-center gap-2">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span class="hidden lg:inline">Mode administrateur</span>
                            <span class="lg:hidden">Admin</span>
                        </div>
                        
                        <div class="flex items-center gap-2 sm:gap-3 bg-gray-100 dark:bg-gray-700 rounded-full pl-1 pr-2 sm:pr-3 lg:pr-4 py-1">
                            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                SA
                            </div>
                            <span class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline truncate max-w-[100px] lg:max-w-none">Sandrine AFOTO</span>
                            <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>
            
            <div class="bg-veep-beige/30 dark:bg-gray-800/30 py-2 sm:py-3 px-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                Vous êtes connecté en tant qu'<span class="font-bold">administrateur</span>
            </div>
            
            <div class="p-4 sm:p-6 lg:p-8 flex-1">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const route = useRoute();
const isMobileMenuOpen = ref(false);
</script>

<style scoped>
.bg-veep-orange {
    background-color: #FF6B35;
}

.bg-veep-orange-light {
    background-color: #FFF3E0;
}

.text-veep-orange {
    color: #FF6B35;
}

.bg-veep-beige {
    background-color: #FFF8F0;
}

.bg-veep-beige-dark {
    background-color: #FFE4CC;
}

.border-veep-beige-dark {
    border-color: #FFE4CC;
}

@media (max-width: 1023px) {
    aside {
        overscroll-behavior: contain;
    }
}

aside {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
