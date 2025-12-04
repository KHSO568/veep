<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-veep-beige border-r border-veep-beige-dark flex flex-col">
      <div class="p-6">
        <NuxtLink to="/" class="flex items-center gap-2">
          <NuxtImg src="/Vector.webp" alt="VEEP" class="h-8 w-28"> </NuxtImg>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-3">
        <div class="space-y-1">
          <NuxtLink to="/admin" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('admin')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 hover:bg-veep-beige-dark',
          ]">
            <NuxtImg src="/bank.png" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Dashboard</div>
          </NuxtLink>
          <NuxtLink to="/admin/users/invitations" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('invitations')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 hover:bg-veep-beige-dark',
          ]">
            <NuxtImg src="/bank.png" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Organisateurs</div>
          </NuxtLink>

          <NuxtLink to="/admin/users" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path === '/admin/users'
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 hover:bg-veep-beige-dark',
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
              'text-gray-700 hover:bg-veep-beige-dark',
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
              <NuxtLink to="/admin/cards/stock"
                class="px-4 py-2 text-sm text-gray-600 hover:text-veep-orange flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Stock
              </NuxtLink>
              <NuxtLink to="/admin/cards/activation"
                class="px-4 py-2 text-sm text-gray-600 hover:text-veep-orange flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Activation
              </NuxtLink>
            </div>
          </div>

          <NuxtLink to="/admin" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('compensations')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 hover:bg-veep-beige-dark',
          ]">
            <NuxtImg src="/img_receipt.webp" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Compensations</div>
          </NuxtLink>

          <NuxtLink to="/admin/" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('reversements')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 hover:bg-veep-beige-dark',
          ]">
            <NuxtImg src="/img_note-2.webp" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Reversements</div>
          </NuxtLink>

          <NuxtLink to="/profile/settings" :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium',
            $route.path.includes('settings')
              ? 'bg-veep-orange text-white shadow-sm'
              : 'text-gray-700 hover:bg-veep-beige-dark',
          ]">
            <NuxtImg src="/img_lock.webp" alt="Invitations" class="w-6 h-6" />
            <div class="text-sm font-medium">Droits d'accès</div>
          </NuxtLink>
        </div>
      </nav>

      <div class="p-4 border-t border-veep-beige-dark">
        <div v-if="user" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold">
            {{ user.email?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user.Name || user.email }}
            </p>
            <button @click="logout" class="text-xs text-veep-orange hover:text-veep-orange-dark">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <header class="bg-white border-b border-gray-200 px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="text-4xl font-Baloo font-bold">Organisateurs</div>
          <div class="flex items-center gap-4">
            <div
              class="flex items-center gap-3 bg-gray-100 rounded-full pl-1 pr-4 py-1 cursor-pointer hover:bg-gray-200 transition-colors">
              <div
                class="w-8 h-8 rounded-full bg-veep-orange flex items-center justify-center text-white font-bold text-sm">
                {{ user?.email?.charAt(0).toUpperCase() || "S" }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{
                user?.displayName || "Sandrine APOTO"
              }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div class="p-8">
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
