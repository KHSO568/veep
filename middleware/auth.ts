export default defineNuxtRouteMiddleware((to, from) => {
    const { user, loading } = useAuth()

    // Allow access to auth pages
    if (to.path.startsWith('/auth')) {
        // If user is already logged in and tries to access login/register, redirect to admin
        if (user.value && !loading.value) {
            return navigateTo('/admin')
        }
        return
    }

    // Wait for auth to initialize
    if (loading.value) {
        return
    }

    // Redirect to login if not authenticated
    if (!user.value) {
        return navigateTo('/auth/login')
    }

    // Redirect authenticated users from root to admin dashboard
    if (to.path === '/') {
        return navigateTo('/admin')
    }
})
