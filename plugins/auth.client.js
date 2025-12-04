export default defineNuxtPlugin((nuxtApp) => {
  // Initialize auth state management after Firebase is loaded
  const { initAuth } = useAuth()
  initAuth()
})
