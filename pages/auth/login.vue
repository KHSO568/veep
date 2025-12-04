<template>
    <NuxtLayout name="auth">
        <div class="space-y-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
                <p class="text-gray-600 text-sm">Connectez-vous à votre compte</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input v-model="email" type="email" required placeholder="nom@exemple.com"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                    <input v-model="password" type="password" required placeholder="••••••••"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="w-4 h-4 text-veep-orange border-gray-300 rounded focus:ring-veep-orange" />
                        <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                    </label>
                    <NuxtLink to="/auth/forgot-password" class="text-sm text-veep-orange hover:text-veep-orange-dark">
                        Mot de passe oublié ?
                    </NuxtLink>
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-veep-orange text-white py-3 px-4 rounded-lg font-medium hover:bg-veep-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Connexion...' : 'Se connecter' }}
                </button>
            </form>

            <div class="text-center">
                <span class="text-gray-600 text-sm">Vous n'avez pas de compte ? </span>
                <NuxtLink to="/auth/register" class="text-veep-orange hover:text-veep-orange-dark font-medium text-sm">
                    S'inscrire
                </NuxtLink>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm">{{ error }}</p>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';

definePageMeta({
    layout: false
});

const { $auth } = useNuxtApp();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    try {
        await signInWithEmailAndPassword($auth, email.value, password.value);

        // Redirect to home after successful login
        router.push('/admin');
    } catch (err) {
        console.error('Login error:', err);
        error.value = err.code === 'auth/invalid-credential'
            ? 'Email ou mot de passe incorrect'
            : 'Erreur de connexion. Veuillez réessayer.';
    } finally {
        loading.value = false;
    }
};
</script>
