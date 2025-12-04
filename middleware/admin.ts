export default defineNuxtRouteMiddleware((to, from) => {
    const { user, isAdmin, loading } = useAuth()

    // Wait for auth to initialize
    if (loading.value) {
        return
    }

    // Redirect if not authenticated
    if (!user.value) {
        return navigateTo('/')
    }

    // Allow all authenticated users
    // if (!isAdmin.value) {
    //     return abortNavigation('Accès non autorisé')
    // }
})
