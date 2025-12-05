<template>
    <NuxtLayout name="auth">
        <div class="space-y-8">
            <div>
                <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-2">Connexion</h1>
                <p class="text-gray-600 dark:text-gray-400 text-lg">
                    Entrez vos identifiants pour vous connecter à votre espace de travail
                </p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input v-model="email" type="email" required placeholder="hello@exemple.com"
                        class="w-full px-3 py-4 rounded-lg focus:outline-none focus:ring-2 bg-[#F6F6F6] dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-veep-orange focus:border-transparent transition-colors" />
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mot de
                            passe</label>
                        <NuxtLink to="/auth/forgot-password"
                            class="text-sm text-[#34ABAB] hover:text-veep-orange-dark dark:text-veep-orange">
                            Mot de passe oublié ?
                        </NuxtLink>
                    </div>
                    <input v-model="password" type="password" required placeholder="••••••••"
                        class="w-full px-3 py-4 bg-[#F6F6F6] dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent transition-colors" />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full sm:w-64 bg-[#FF6B00] text-white h-14 rounded-full font-extrabold hover:bg-veep-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="loading">Connexion en cours...</span>
                    <span v-else>Se connecter</span>
                </button>
            </form>

            <div class="text-left">
                <span class="text-gray-600 text-lg">Vous n'avez pas de compte ? </span>
                <NuxtLink to="/auth/register"
                    class="text-[#34ABAB] hover:text-veep-orange-dark font-medium text-lg underline">
                    Créer un compte
                </NuxtLink>
            </div>

            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg ">
                <p class="text-red-600 text-sm">{{ error }}</p>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";

definePageMeta({
    layout: false,
});

const { $auth } = useNuxtApp();
const router = useRouter();
const { logAction } = useAuditLog();
const toast = useToast();
const { getFirebaseErrorMessage } = await import("~/utils/errorMessages");

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
    loading.value = true;
    error.value = "";

    try {
        const userCredential = await signInWithEmailAndPassword(
            $auth,
            email.value,
            password.value
        );

        try {
            await logAction("user_login", "auth", userCredential.user.uid, {
                email: email.value,
            });
        } catch (logError) {
            console.warn("Failed to log login:", logError);
        }

        toast.success("Connexion réussie");
        router.push("/admin");
    } catch (err) {
        console.error("Login error:", err);
        const errorMessage = getFirebaseErrorMessage(err.code);
        error.value = errorMessage;
        toast.error(errorMessage);
    } finally {
        loading.value = false;
    }
};
</script>
