export default defineNuxtRouteMiddleware((to, from) => {
    const { user, isAdmin, isModerator, loading } = useAuth()

    // Wait for auth to initialize
    if (loading.value) {
        return
    }

    // Redirect if not authenticated
    if (!user.value) {
        return navigateTo('/')
    }

    // Redirect moderators to Organisateurs when trying to access Dashboard
    if (isModerator.value && to.path === '/admin') {
        return navigateTo('/admin/users/invitations')
    }

    // Allow all authenticated users to access admin routes
})
