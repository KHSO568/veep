<template>
  <NuxtLayout name="admin">
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Mon Profil</h1>
        <p class="text-sm text-gray-500 mt-1">Gérer vos paramètres de sécurité</p>
      </div>

      <div class="flex gap-8 mb-8 border-b border-gray-200">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
          'pb-4 text-sm font-medium transition-all relative',
          activeTab === tab.id ? 'text-veep-orange border-b-2 border-veep-orange' : 'text-gray-500 hover:text-gray-700'
        ]">
          {{ tab.label }}
        </button>
      </div>

      <ProfileTab v-if="activeTab === 'profile'" :user="user" :displayName="displayName" :saving="updating"
        @update:displayName="displayName = $event" @save="updateProfile" />

      <SecurityTab v-if="activeTab === 'security'" :twoFactorStatus="twoFactorStatus" :enrolling="enrolling"
        @start-enrollment="startEnrollment" @regenerate-codes="regenerateCodes" @disable="disable2FA"
        @reset-password="sendPasswordReset">
        <template #enrollment>
          <TwoFactorEnrollment v-if="enrolling" :qrCodeUrl="qrCodeUrl" :secret="secret" :backupCodes="backupCodes"
            :verificationCode="verificationCode" @update:verificationCode="verificationCode = $event" 
            @download-codes="downloadBackupCodes" @cancel="cancelEnrollment" @complete="complete2FAEnrollment" />
        </template>
      </SecurityTab>

      <SessionsTab v-if="activeTab === 'sessions'" :deviceInfo="sessionDeviceInfo" :timeRemaining="sessionTimeRemaining" />

      <ToastNotification :message="message" :type="messageType" />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

definePageMeta({ middleware: 'auth' });

const { $db, $auth } = useNuxtApp();
const { user } = useAuth();
const { logAction } = useAuditLog();
const {
  generateSecret,
  enable2FA: enable2FAComposable,
  disable2FA: disable2FAComposable,
  check2FAStatus,
  regenerateBackupCodes: regenerateCodesComposable,
  qrCodeUrl,
  secret,
  backupCodes
} = use2FA();
const { formatTimeRemaining } = useSession();

const activeTab = ref('profile');
const tabs = [
  { id: 'profile', label: 'Profil' },
  { id: 'security', label: 'Sécurité' },
  { id: 'sessions', label: 'Sessions' }
];

const displayName = ref('');
const updating = ref(false);
const enrolling = ref(false);
const twoFactorStatus = ref(null);
const verificationCode = ref('');
const message = ref('');
const messageType = ref('success');

const sessionDeviceInfo = computed(() => {
  if (import.meta.client) {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome sur ' + (ua.includes('Mac') ? 'Mac' : 'Windows');
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    return 'Navigateur inconnu';
  }
  return 'Chargement...';
});

const sessionTimeRemaining = computed(() => formatTimeRemaining());

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => (message.value = ''), 3000);
};

const updateProfile = async () => {
  if (!user.value) return;
  try {
    updating.value = true;
    await updateDoc(doc($db, 'users', user.value.uid), { displayName: displayName.value });
    await logAction('update_profile', 'user', user.value.uid);
    showMessage('Profil mis à jour avec succès');
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Erreur lors de la mise à jour', 'error');
  } finally {
    updating.value = false;
  }
};

const startEnrollment = async () => {
  try {
    enrolling.value = true;
    await generateSecret();
  } catch (error) {
    console.error('Error starting enrollment:', error);
    showMessage("Erreur lors de l'initialisation de 2FA", 'error');
    enrolling.value = false;
  }
};

const complete2FAEnrollment = async () => {
  try {
    await enable2FAComposable(verificationCode.value);
    enrolling.value = false;
    verificationCode.value = '';
    twoFactorStatus.value = await check2FAStatus(user.value.uid);
    showMessage('2FA activé avec succès !');
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    showMessage(error.message || 'Code de vérification invalide', 'error');
  }
};

const cancelEnrollment = () => {
  enrolling.value = false;
  verificationCode.value = '';
};

const disable2FA = async () => {
  if (!confirm('Êtes-vous sûr de vouloir désactiver 2FA ?')) return;
  try {
    await disable2FAComposable('');
    twoFactorStatus.value = null;
    showMessage('2FA désactivé');
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    showMessage('Erreur lors de la désactivation', 'error');
  }
};

const regenerateCodes = async () => {
  if (!confirm('Vos anciens codes de sauvegarde ne fonctionneront plus. Continuer ?')) return;
  try {
    const newCodes = await regenerateCodesComposable();
    showMessage('Nouveaux codes générés');
    downloadBackupCodes(newCodes);
  } catch (error) {
    console.error('Error regenerating codes:', error);
    showMessage('Erreur lors de la génération', 'error');
  }
};

const downloadBackupCodes = (codes = backupCodes.value) => {
  const text = codes.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'veep-backup-codes.txt';
  a.click();
  URL.revokeObjectURL(url);
};

const sendPasswordReset = async () => {
  if (!user.value?.email) return;
  try {
    await sendPasswordResetEmail($auth, user.value.email);
    showMessage('Email de réinitialisation envoyé');
  } catch (error) {
    console.error('Error sending password reset:', error);
    showMessage("Erreur lors de l'envoi", 'error');
  }
};

onMounted(async () => {
  if (user.value) {
    displayName.value = user.value.displayName || '';
    twoFactorStatus.value = await check2FAStatus(user.value.uid);
  }
});
</script>
