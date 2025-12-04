<template>
    <NuxtLayout name="auth">
        <div class="space-y-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Inscription</h1>
                <p class="text-gray-600 text-sm">Créez votre compte VEEP</p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <input v-model="name" type="text" required placeholder="Jean Dupont"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input v-model="email" type="email" required placeholder="nom@exemple.com"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                    <input v-model="password" type="password" required minlength="6" placeholder="Minimum 6 caractères"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                    <input v-model="confirmPassword" type="password" required minlength="6"
                        placeholder="Retapez votre mot de passe"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                </div>

                <button type="submit" :disabled="loading || password !== confirmPassword"
                    class="w-full bg-veep-orange text-white py-3 px-4 rounded-lg font-medium hover:bg-veep-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Inscription...' : 'S\'inscrire' }}
                </button>
            </form>

            <div class="text-center">
                <span class="text-gray-600 text-sm">Vous avez déjà un compte ? </span>
                <NuxtLink to="/auth/login" class="text-veep-orange hover:text-veep-orange-dark font-medium text-sm">
                    Se connecter
                </NuxtLink>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm">{{ error }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-green-600 text-sm">{{ success }}</p>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

definePageMeta({
    layout: false
});

const { $auth, $db } = useNuxtApp();
const router = useRouter();
const { logAction } = useAuditLog();
const toast = useToast();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

// Watch for password mismatch
watch([password, confirmPassword], () => {
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
        error.value = 'Les mots de passe ne correspondent pas';
    } else {
        error.value = '';
    }
});

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        error.value = 'Les mots de passe ne correspondent pas';
        return;
    }

    loading.value = true;
    error.value = '';
    success.value = '';

    try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword($auth, email.value, password.value);
        const user = userCredential.user;

        // Update profile with display name
        await updateProfile(user, {
            displayName: name.value
        });

        const role = email.value === 'k88905177@gmail.com' ? 'admin' : 'moderator';

        await setDoc(doc($db, 'users', user.uid), {
            email: email.value,
            Name: name.value,
            displayName: name.value,
            role: role,
            createdAt: serverTimestamp(),
            isLocked: false,
            failedLoginAttempts: 0
        });

        // Log registration in audit logs
        try {
            await logAction('user_registered', 'user', user.uid, {
                email: email.value,
                name: name.value,
                role: role
            });
        } catch (logError) {
            console.warn('Failed to log registration:', logError);
        }

        success.value = 'Inscription réussie !';
        toast.success('Inscription réussie !');

        // Immediate redirect
        await navigateTo('/admin');
    } catch (err) {
        console.error('Registration error:', err);

        const { getFirebaseErrorMessage } = await import('~/utils/errorMessages');
        const errorMessage = getFirebaseErrorMessage(err.code);
        error.value = errorMessage;
        toast.error(errorMessage);
    } finally {
        loading.value = false;
    }
};
</script>
