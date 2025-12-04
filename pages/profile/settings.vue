<template>
    <NuxtLayout name="admin">
        <div>
            <!-- Page header -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Mon Profil</h1>
                <p class="text-sm text-gray-500 mt-1">Gérer vos paramètres de sécurité</p>
            </div>

            <!-- Tabs -->
            <div class="flex gap-8 mb-8 border-b border-gray-200">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'pb-4 text-sm font-medium transition-all relative',
                    activeTab === tab.id
                        ? 'text-veep-orange border-b-2 border-veep-orange'
                        : 'text-gray-500 hover:text-gray-700'
                ]">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'" class="max-w-2xl">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-6">Informations du profil</h2>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" :value="user?.email" disabled
                                class="w-full bg-gray-50 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg cursor-not-allowed" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'affichage</label>
                            <input v-model="displayName" type="text" placeholder="Votre nom"
                                class="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                            <div class="flex items-center gap-2">
                                <UserRoleBadge :role="user?.role" />
                            </div>
                        </div>

                        <div class="pt-4">
                            <button @click="updateProfile" :disabled="updating"
                                class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2">
                                <span v-if="updating"
                                    class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                {{ updating ? "Enregistrement..." : "Enregistrer" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Security Tab (2FA) -->
            <div v-if="activeTab === 'security'" class="max-w-3xl space-y-6">
                <!-- 2FA Status -->
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">Authentification à deux facteurs (2FA)</h2>
                            <p class="text-gray-500 text-sm mt-1">Ajoutez une couche de sécurité supplémentaire à votre
                                compte</p>
                        </div>
                        <div v-if="twoFactorStatus?.enabled"
                            class="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            Activé
                        </div>
                        <div v-else
                            class="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
                            Désactivé
                        </div>
                    </div>

                    <!-- Not Enrolled -->
                    <div v-if="!twoFactorStatus?.enabled && !enrolling">
                        <p class="text-gray-600 mb-6">
                            L'authentification à deux facteurs n'est pas encore activée sur votre compte. Cliquez
                            ci-dessous pour commencer l'inscription.
                        </p>
                        <button @click="startEnrollment"
                            class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium">
                            Activer 2FA
                        </button>
                    </div>

                    <!-- Enrollment Process -->
                    <div v-if="enrolling" class="space-y-6">
                        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                <div>
                                    <h3 class="font-semibold text-amber-800 text-sm">Gardez vos codes de sauvegarde en
                                        sécurité</h3>
                                    <p class="text-amber-700 text-sm mt-1">
                                        Vous aurez besoin de ces codes si vous perdez l'accès à votre appareil
                                        d'authentification.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Step 1: Scan QR Code -->
                        <div class="text-center border-b border-gray-100 pb-6">
                            <h3 class="text-base font-semibold text-gray-900 mb-2">1. Scannez ce code QR</h3>
                            <p class="text-gray-500 text-sm mb-4">Utilisez une application comme Google Authenticator ou
                                Authy</p>
                            <div v-if="qrCodeUrl"
                                class="inline-block bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <img :src="qrCodeUrl" alt="QR Code" class="w-48 h-48" />
                            </div>
                            <p class="text-sm text-gray-500 mt-4">
                                Ou entrez manuellement : <code
                                    class="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono text-xs">{{ secret }}</code>
                            </p>
                        </div>

                        <!-- Step 2: Backup Codes -->
                        <div class="border-b border-gray-100 pb-6">
                            <h3 class="text-base font-semibold text-gray-900 mb-4">2. Sauvegardez vos codes de
                                récupération</h3>
                            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-3">
                                <div v-for="(code, index) in backupCodes" :key="index"
                                    class="font-mono text-center text-sm text-gray-600 bg-white border border-gray-100 py-1.5 rounded">
                                    {{ code }}
                                </div>
                            </div>
                            <button @click="downloadBackupCodes"
                                class="mt-4 text-veep-orange hover:text-veep-orange-dark text-sm font-medium flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Télécharger les codes
                            </button>
                        </div>

                        <!-- Step 3: Verify -->
                        <div>
                            <h3 class="text-base font-semibold text-gray-900 mb-4">3. Vérifiez votre configuration</h3>
                            <p class="text-gray-500 text-sm mb-4">Entrez le code de votre application d'authentification
                                :</p>
                            <input v-model="verificationCode" type="text" placeholder="000000" maxlength="6"
                                class="w-full max-w-xs bg-white border border-gray-300 text-gray-900 text-center text-2xl tracking-widest p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent font-mono" />
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button @click="cancelEnrollment"
                                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                                Annuler
                            </button>
                            <button @click="complete2FAEnrollment"
                                :disabled="!verificationCode || verificationCode.length !== 6"
                                class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50">
                                Activer 2FA
                            </button>
                        </div>
                    </div>

                    <!-- Enrolled -->
                    <div v-if="twoFactorStatus?.enabled && !enrolling">
                        <p class="text-gray-600 mb-6">
                            Votre compte est protégé par l'authentification à deux facteurs.
                        </p>
                        <div class="flex gap-3">
                            <button @click="regenerateCodes"
                                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                                Régénérer codes de sauvegarde
                            </button>
                            <button @click="disable2FA"
                                class="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-sm font-medium">
                                Désactiver 2FA
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Password Change -->
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
                    <p class="text-gray-500 text-sm mb-6">
                        Utilisez la fonctionnalité de réinitialisation du mot de passe de Firebase.
                    </p>
                    <button @click="sendPasswordReset"
                        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                        Envoyer un email de réinitialisation
                    </button>
                </div>
            </div>

            <!-- Sessions Tab -->
            <div v-if="activeTab === 'sessions'" class="max-w-3xl">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-6">Sessions actives</h2>
                    <div class="space-y-4">
                        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">Session actuelle</div>
                                    <div class="text-sm text-gray-500">{{ sessionDeviceInfo }}</div>
                                    <div class="text-xs text-gray-400 mt-0.5">Expire dans: {{ sessionTimeRemaining }}
                                    </div>
                                </div>
                            </div>
                            <span
                                class="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Actif</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Toast -->
            <div v-if="message" :class="[
                'fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg text-white z-50',
                messageType === 'success' ? 'bg-green-500' : 'bg-red-500',
                'animate-toast'
            ]">
                {{ message }}
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

definePageMeta({
    middleware: "auth",
});

const { $db, $auth } = useNuxtApp();
const { user } = useAuth();
const { logAction } = useAuditLog();
const {
    generateSecret,
    verifyToken,
    enable2FA: enable2FAComposable,
    disable2FA: disable2FAComposable,
    check2FAStatus,
    regenerateBackupCodes: regenerateCodesComposable,
    qrCodeUrl,
    secret,
    backupCodes
} = use2FA();
const { sessionId, formatTimeRemaining } = useSession();

const activeTab = ref("profile");
const tabs = [
    { id: "profile", label: "Profil" },
    { id: "security", label: "Sécurité" },
    { id: "sessions", label: "Sessions" }
];

// Profile
const displayName = ref("");
const updating = ref(false);

// 2FA
const enrolling = ref(false);
const twoFactorStatus = ref(null);
const verificationCode = ref("");

// Session
const sessionDeviceInfo = computed(() => {
    if (import.meta.client) {
        const ua = navigator.userAgent;
        if (ua.includes("Chrome")) return "Chrome sur " + (ua.includes("Mac") ? "Mac" : "Windows");
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari")) return "Safari";
        return "Navigateur inconnu";
    }
    return "Chargement...";
});

const sessionTimeRemaining = computed(() => {
    return formatTimeRemaining();
});

// Toast
const message = ref("");
const messageType = ref("success");

const showMessage = (text, type = "success") => {
    message.value = text;
    messageType.value = type;
    setTimeout(() => (message.value = ""), 3000);
};

// Profile Methods
const updateProfile = async () => {
    if (!user.value) return;

    try {
        updating.value = true;

        await updateDoc(doc($db, "users", user.value.uid), {
            displayName: displayName.value
        });

        await logAction("update_profile", "user", user.value.uid);

        showMessage("Profil mis à jour avec succès");
    } catch (error) {
        console.error("Error updating profile:", error);
        showMessage("Erreur lors de la mise à jour", "error");
    } finally {
        updating.value = false;
    }
};

// 2FA Methods
const startEnrollment = async () => {
    try {
        enrolling.value = true;
        await generateSecret();
    } catch (error) {
        console.error("Error starting enrollment:", error);
        showMessage("Erreur lors de l'initialisation de 2FA", "error");
        enrolling.value = false;
    }
};

const complete2FAEnrollment = async () => {
    try {
        await enable2FAComposable(verificationCode.value);
        enrolling.value = false;
        verificationCode.value = "";
        twoFactorStatus.value = await check2FAStatus(user.value.uid);
        showMessage("2FA activé avec succès !");
    } catch (error) {
        console.error("Error enabling 2FA:", error);
        showMessage(
            error.message || "Code de vérification invalide",
            "error"
        );
    }
};

const cancelEnrollment = () => {
    enrolling.value = false;
    verificationCode.value = "";
};

const disable2FA = async () => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver 2FA ?")) return;

    try {
        await disable2FAComposable("");
        twoFactorStatus.value = null;
        showMessage("2FA désactivé");
    } catch (error) {
        console.error("Error disabling 2FA:", error);
        showMessage("Erreur lors de la désactivation", "error");
    }
};

const regenerateCodes = async () => {
    if (!confirm("Vos anciens codes de sauvegarde ne fonctionneront plus. Continuer ?"))
        return;

    try {
        const newCodes = await regenerateCodesComposable();
        showMessage("Nouveaux codes générés");
        downloadBackupCodes(newCodes);
    } catch (error) {
        console.error("Error regenerating codes:", error);
        showMessage("Erreur lors de la génération", "error");
    }
};

const downloadBackupCodes = (codes = backupCodes.value) => {
    const text = codes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "veep-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
};

const sendPasswordReset = async () => {
    if (!user.value?.email) return;

    try {
        await sendPasswordResetEmail($auth, user.value.email);
        showMessage("Email de réinitialisation envoyé");
    } catch (error) {
        console.error("Error sending password reset:", error);
        showMessage("Erreur lors de l'envoi", "error");
    }
};

onMounted(async () => {
    if (user.value) {
        displayName.value = user.value.displayName || "";
        twoFactorStatus.value = await check2FAStatus(user.value.uid);
    }
});
</script>

<style scoped>
@keyframes toast {
    from {
        transform: translateX(120%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-toast {
    animation: toast 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
