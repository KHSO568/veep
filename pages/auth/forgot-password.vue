<template>
  <NuxtLayout name="auth">
    <div class="w-full max-w-md space-y-8">
      <!-- Back Button -->
      <div class="absolute top-4 left-4">
        <NuxtLink
          to="/auth/login"
          class="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour
        </NuxtLink>
      </div>

      <div class="text-center">
        <h2
          class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-Baloo"
        >
          Mot de passe oublié ?
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleReset">
        <div>
          <label for="email" class="sr-only">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            v-model="email"
            class="relative block w-full rounded-lg border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-veep-orange sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            placeholder="Adresse email"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-lg bg-veep-orange px-3 py-3 text-sm font-semibold text-white hover:bg-veep-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-veep-orange disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                v-if="!loading"
                class="h-5 w-5 text-white group-hover:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? "Envoi en cours..." : "Envoyer le lien" }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="font-medium text-veep-orange hover:text-veep-orange-dark text-sm"
          >
            Retour à la connexion
          </NuxtLink>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";
import { sendPasswordResetEmail } from "firebase/auth";

definePageMeta({
  layout: false,
});

const { $auth } = useNuxtApp();
const toast = useToast();
const email = ref("");
const loading = ref(false);

const handleReset = async () => {
  if (!email.value) return;

  loading.value = true;
  try {
    await sendPasswordResetEmail($auth, email.value);
    toast.success(
      "Email de réinitialisation envoyé ! Vérifiez votre boîte mail."
    );
    email.value = "";
  } catch (error) {
    console.error("Reset error:", error);
    let message = "Une erreur est survenue.";
    if (error.code === "auth/user-not-found")
      message = "Aucun compte associé à cet email.";
    if (error.code === "auth/invalid-email") message = "Email invalide.";
    toast.error(message);
  } finally {
    loading.value = false;
  }
};
</script>
