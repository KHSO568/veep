import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export type UserRole = 'admin' | 'moderator' | 'user'

export interface UserProfile {
    uid: string
    email: string | null
    role: UserRole
    Name?: string
    displayName?: string
    createdAt?: any
    lastLogin?: any
    loginAttempts: number
    isLocked: boolean
    lockedUntil?: any
}

const currentUser = ref<UserProfile | null>(null)
const loading = ref(true)

export const useAuth = () => {
    const { $auth, $db } = useNuxtApp()

    const initAuth = () => {
        onAuthStateChanged($auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc($db, 'users', firebaseUser.uid))

                if (userDoc.exists()) {
                    currentUser.value = userDoc.data() as UserProfile

                    await updateDoc(doc($db, 'users', firebaseUser.uid), {
                        lastLogin: serverTimestamp()
                    })
                } else {
                    const newProfile: UserProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        role: 'user',
                        createdAt: serverTimestamp(),
                        lastLogin: serverTimestamp(),
                        loginAttempts: 0,
                        isLocked: false
                    }

                    await setDoc(doc($db, 'users', firebaseUser.uid), newProfile)
                    currentUser.value = newProfile
                }
            } else {
                currentUser.value = null
            }
            loading.value = false
        })
    }

    const isAdmin = computed(() => currentUser.value?.role === 'admin')
    const isModerator = computed(() => currentUser.value?.role === 'moderator')
    const isUser = computed(() => currentUser.value?.role === 'user')

    const hasRole = (role: UserRole) => {
        return currentUser.value?.role === role
    }

    const hasPermission = (permission: string): boolean => {
        const userRole = currentUser.value?.role
        if (!userRole) return false

        const permissions: Record<UserRole, string[]> = {
            admin: ['*'],
            moderator: [
                'events:read', 'events:write', 'events:delete',
                'products:read', 'products:write', 'products:delete',
                'users:read'
            ],
            user: [
                'events:read', 'events:write:own', 'events:delete:own',
                'products:read', 'products:write:own', 'products:delete:own'
            ]
        }

        const rolePermissions = permissions[userRole]
        return rolePermissions.includes('*') || rolePermissions.includes(permission)
    }

    const isAccountLocked = computed(() => {
        if (!currentUser.value?.isLocked) return false

        if (currentUser.value.lockedUntil) {
            const lockTime = currentUser.value.lockedUntil.toDate?.() || new Date(currentUser.value.lockedUntil)
            return new Date() < lockTime
        }

        return false
    })

    return {
        user: currentUser,
        loading,
        isAdmin,
        isModerator,
        isUser,
        hasRole,
        hasPermission,
        isAccountLocked,
        initAuth
    }
}
