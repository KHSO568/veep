<template>
  <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-2xl">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-black text-white tracking-tight">
              {{ t('Title') }}
            </h1>
            <p class="text-indigo-200 text-sm mt-1">
              Gestion intelligente de vos événements
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink v-if="isAdmin" to="/admin"
            class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all font-semibold border border-white/20">
            🛡️ Admin
          </NuxtLink>
          <div v-if="user" class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-white font-semibold">{{ user.email }}</p>
              <button @click="logout" class="text-indigo-200 hover:text-white text-sm transition-colors">
                Déconnexion
              </button>
            </div>
            <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {{ user.email?.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div v-else class="flex gap-3">
            <button @click="showLogin = true"
              class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all font-semibold border border-white/20">
              Connexion
            </button>
            <button @click="showRegister = true"
              class="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-2 rounded-xl transition-all font-semibold">
              Inscription
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Message de notification -->
  <div v-if="message" :class="[
    'fixed top-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white z-50 backdrop-blur-xl border-2',
    messageType === 'success'
      ? 'bg-emerald-500/90 border-emerald-400'
      : 'bg-rose-500/90 border-rose-400',
    'animate-toast',
  ]">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <span class="text-xl">{{
          messageType === "success" ? "✓" : "✗"
        }}</span>
      </div>
      <span class="font-semibold">{{ message }}</span>
    </div>
  </div>

  <!-- Modale de connexion -->
  <div v-if="showLogin"
    class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
    <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-700">
      <h3 class="text-2xl font-bold mb-6 text-center text-white">
        Connexion
      </h3>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-300 mb-2">Email</label>
          <input v-model="loginEmail" type="email" placeholder="votre@email.com" required
            class="w-full bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-xl focus:border-purple-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-300 mb-2">Mot de passe</label>
          <input v-model="loginPassword" type="password" placeholder="Votre mot de passe" required
            class="w-full bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-xl focus:border-purple-500 outline-none" />
        </div>
        <div class="flex gap-3 pt-4">
          <button type="button" @click="showLogin = false"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-all font-semibold">
            Annuler
          </button>
          <button type="submit"
            class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl transition-all font-semibold">
            Se connecter
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modale d'inscription -->
  <div v-if="showRegister"
    class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
    <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-700">
      <h3 class="text-2xl font-bold mb-6 text-center text-white">
        Inscription
      </h3>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-300 mb-2">Email</label>
          <input v-model="registerEmail" type="email" placeholder="votre@email.com" required
            class="w-full bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-xl focus:border-purple-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-300 mb-2">Mot de passe</label>
          <input v-model="registerPassword" type="password" placeholder="Minimum 6 caractères" required
            class="w-full bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-xl focus:border-purple-500 outline-none" />
        </div>
        <div class="flex gap-3 pt-4">
          <button type="button" @click="showRegister = false"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-all font-semibold">
            Annuler
          </button>
          <button type="submit"
            class="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-xl transition-all font-semibold">
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  collection,
  onSnapshot,
  query,
  orderBy,

} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const { t } = useI18n();

const { $db, $auth } = useNuxtApp();
const { user: isAdmin } = useAuth();
console.log(t('Title'));


const user = ref(null);
const showLogin = ref(false);
const showRegister = ref(false);
const loginEmail = ref("");
const loginPassword = ref("");
const registerEmail = ref("");
const registerPassword = ref("");


const login = async () => {
  try {
    await signInWithEmailAndPassword(
      $auth,
      loginEmail.value,
      loginPassword.value
    );
    showLogin.value = false;
    loginEmail.value = "";
    loginPassword.value = "";
    showMessage("Connexion réussie !");
  } catch (error) {
    showMessage("Erreur de connexion: " + error.message, "error");
  }
};

const register = async () => {
  try {
    await createUserWithEmailAndPassword(
      $auth,
      registerEmail.value,
      registerPassword.value
    );
    showRegister.value = false;
    registerEmail.value = "";
    registerPassword.value = "";
    showMessage("Inscription réussie !");
  } catch (error) {
    showMessage("Erreur d'inscription: " + error.message, "error");
  }
};


const logout = async () => {
  try {
    await signOut($auth);
    showMessage("Déconnexion réussie");
  } catch (error) {
    showMessage("Erreur de déconnexion: " + error.message, "error");
  }
};

const events = ref([]);

const message = ref("");
const messageType = ref("success");

const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => (message.value = ""), 3000);
};

const showConfirm = ref(false);
const confirmMessage = ref("");
let confirmCallback = null;

const openConfirm = (text, callback) => {
  confirmMessage.value = text;
  confirmCallback = callback;
  showConfirm.value = true;
};

onMounted(() => {
  onAuthStateChanged($auth, (userData) => {
    user.value = userData;
  });

  const q = query(collection($db, "events"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      events.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    (error) => {
      console.error("Erreur lors de la récupération des événements:", error);
      showMessage("Erreur de chargement des événements", "error");
    }
  );

  onUnmounted(() => {
    unsubscribe();
  });
});

</script>
