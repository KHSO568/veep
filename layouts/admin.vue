<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Mobile Backdrop -->
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"></div>

    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-veep-beige dark:bg-gray-900 border-r border-veep-beige-dark dark:border-gray-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="p-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <NuxtImg src="/Vector.webp" alt="VEEP" class="h-8 w-28 block dark:hidden"> </NuxtImg>
          <!-- White logo for dark mode (assuming text based or you have a white version, using text fallback for now if no image) -->
          <span class="text-2xl font-bold text-white hidden dark:block">VEEP</span>
        </NuxtLink>
        <!-- Close button for mobile -->
        <button @click="isMobileMenuOpen = false"
          class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 px-3 overflow-y-auto">
        <div class="space-y-1">
          <NuxtLink to="/admin" @click="isMobileMenuOpen = false" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('admin') && !$route.path.includes('users') && !$route.path.includes('settings') && !$route.path.includes('compensations')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
          ]">
            <NuxtImg src="/bank.png" alt="Dashboard" class="w-6 h-6" />
            <div class="text-sm font-medium">Dashboard</div>
          </NuxtLink>
          <NuxtLink to="/admin/users/invitations" @click="isMobileMenuOpen = false" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('invitations')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
          ]">
            <NuxtImg src="/bank.png" alt="Organisateurs" class="w-6 h-6" />
            <div class="text-sm font-medium">Organisateurs</div>
          </NuxtLink>

          <NuxtLink to="/admin/users" @click="isMobileMenuOpen = false" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path === '/admin/users'
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
          ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div class="text-sm font-medium">Utilisateurs</div>
          </NuxtLink>

          <div>
            <button @click="cartesOpen = !cartesOpen" :class="[
              'w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
              'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
            ]">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Cartes
              </div>
              <svg :class="[
                'w-4 h-4 transition-transform',
                cartesOpen && 'rotate-180',
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="cartesOpen" class="ml-11 mt-1 space-y-1">
              <NuxtLink to="/admin/cards/stock" @click="isMobileMenuOpen = false"
                class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-veep-orange flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Stock
              </NuxtLink>
              <NuxtLink to="/admin/cards/activation" @click="isMobileMenuOpen = false"
                class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-veep-orange flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Activation
              </NuxtLink>
            </div>
          </div>

          <NuxtLink to="/admin" @click="isMobileMenuOpen = false" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('compensations')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
          ]">
            <NuxtImg src="/img_receipt.webp" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Compensations</div>
          </NuxtLink>

          <NuxtLink to="/admin/" @click="isMobileMenuOpen = false" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('reversements')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
          ]">
            <NuxtImg src="/img_note-2.webp" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Reversements</div>
          </NuxtLink>

          <NuxtLink to="/admin/settings/access" @click="isMobileMenuOpen = false" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('settings')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-veep-beige-dark dark:hover:bg-gray-800',
          ]">
            <NuxtImg src="/img_lock.webp" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Droits d'accès</div>
          </NuxtLink>
        </div>
      </nav>

      <div class="p-4 border-t border-veep-beige-dark dark:border-gray-800">
        <div v-if="user" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold">
            {{ user.email?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ user.Name || user.email }}
            </p>
            <button @click="logout" class="text-xs text-veep-orange hover:text-veep-orange-dark">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Button (Visible on mobile/tablet) -->
            <button @click="isMobileMenuOpen = true"
              class="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="text-2xl md:text-4xl font-Baloo font-bold text-gray-900 dark:text-white">Organisateurs</div>
          </div>
          <div class="flex items-center gap-4">
            <ThemeToggle />
            <div
              class="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full pl-1 pr-4 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <div
                class="w-8 h-8 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold text-sm">
                {{ user?.email?.charAt(0).toUpperCase() || "S" }}
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">{{
                user?.displayName || "Sandrine APOTO"
                }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div class="p-4 md:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { signOut } from "firebase/auth";

const { $auth } = useNuxtApp();
const { user } = useAuth();
const router = useRouter();
const { logAction } = useAuditLog();

const utilisateursOpen = ref(false);
const cartesOpen = ref(false);
const isMobileMenuOpen = ref(false);

const logout = async () => {
  try {
    // Log logout action before signing out
    if (user.value) {
      await logAction('user_logout', 'auth', user.value.uid, {
        email: user.value.email
      });
    }

    await signOut($auth);
    router.push("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>
