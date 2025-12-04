import { ref, computed, onMounted, onUnmounted } from 'vue'
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore'

export interface SessionConfig {
    timeout: number
    idleTimeout: number
    maxSessions: number
}

export interface SessionData {
    sessionId: string
    deviceInfo: string
    ipAddress?: string
    loginTime: any
    lastActivity: any
    expiresAt: any
}

const DEFAULT_CONFIG: SessionConfig = {
    timeout: 24 * 60 * 60 * 1000,
    idleTimeout: 30 * 60 * 1000,
    maxSessions: 5
}

export const useSession = (config: Partial<SessionConfig> = {}) => {
    const { $db } = useNuxtApp()
    const { user } = useAuth()
    const { logAction } = useAuditLog()

    const sessionConfig = { ...DEFAULT_CONFIG, ...config }
    const sessionId = ref('')
    const lastActivity = ref(Date.now())
    const isExpired = ref(false)
    const idleTimer = ref<NodeJS.Timeout | null>(null)
    const checkTimer = ref<NodeJS.Timeout | null>(null)

    const expiresAt = computed(() => {
        return new Date(lastActivity.value + sessionConfig.idleTimeout)
    })

    const timeUntilExpiry = computed(() => {
        const now = Date.now()
        const expiry = expiresAt.value.getTime()
        return Math.max(0, expiry - now)
    })

    const isSessionActive = computed(() => {
        return timeUntilExpiry.value > 0 && !isExpired.value
    })

    const initSession = async () => {
        if (!user.value) return

        try {
            sessionId.value = generateSessionId()

            const sessionData: SessionData = {
                sessionId: sessionId.value,
                deviceInfo: getDeviceInfo(),
                loginTime: serverTimestamp(),
                lastActivity: serverTimestamp(),
                expiresAt: Timestamp.fromDate(
                    new Date(Date.now() + sessionConfig.timeout)
                )
            }

            await updateDoc(doc($db, 'users', user.value.uid), {
                currentSession: sessionData,
                lastActivity: serverTimestamp()
            })

            await logAction('session_started', 'session', sessionId.value)

            startIdleDetection()
            startSessionCheck()
        } catch (error) {
            console.error('Error initializing session:', error)
        }
    }

    const refreshSession = async () => {
        if (!user.value || !sessionId.value) return

        try {
            lastActivity.value = Date.now()

            await updateDoc(doc($db, 'users', user.value.uid), {
                'currentSession.lastActivity': serverTimestamp(),
                lastActivity: serverTimestamp()
            })
        } catch (error) {
            console.error('Error refreshing session:', error)
        }
    }

    const endSession = async (reason: string = 'logout') => {
        if (!user.value || !sessionId.value) return

        try {
            await logAction('session_ended', 'session', sessionId.value, {
                reason
            })

            await updateDoc(doc($db, 'users', user.value.uid), {
                currentSession: null
            })

            stopIdleDetection()
            stopSessionCheck()

            sessionId.value = ''
            isExpired.value = true
        } catch (error) {
            console.error('Error ending session:', error)
        }
    }

    const startIdleDetection = () => {
        if (import.meta.client) {
            const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']

            const handleActivity = () => {
                lastActivity.value = Date.now()
                refreshSession()
            }

            activityEvents.forEach(event => {
                window.addEventListener(event, handleActivity)
            })

            idleTimer.value = setInterval(() => {
                if (timeUntilExpiry.value === 0) {
                    handleIdleTimeout()
                }
            }, 10000)
        }
    }

    const stopIdleDetection = () => {
        if (idleTimer.value) {
            clearInterval(idleTimer.value)
            idleTimer.value = null
        }
    }

    const startSessionCheck = () => {
        if (import.meta.client) {
            checkTimer.value = setInterval(() => {
                validateSession()
            }, 60000)
        }
    }

    const stopSessionCheck = () => {
        if (checkTimer.value) {
            clearInterval(checkTimer.value)
            checkTimer.value = null
        }
    }

    const validateSession = async () => {
        if (!user.value) return

        try {
            if (timeUntilExpiry.value === 0) {
                await handleIdleTimeout()
            }
        } catch (error) {
            console.error('Error validating session:', error)
        }
    }

    const handleIdleTimeout = async () => {
        isExpired.value = true
        await logAction('session_expired', 'session', sessionId.value, {
            reason: 'idle_timeout'
        })

        if (import.meta.client) {
            alert('Your session has expired due to inactivity. Please log in again.')
            window.location.href = '/'
        }
    }

    const extendSession = async (additionalTime: number = sessionConfig.timeout) => {
        if (!user.value || !sessionId.value) return

        try {
            const newExpiresAt = Timestamp.fromDate(
                new Date(Date.now() + additionalTime)
            )

            await updateDoc(doc($db, 'users', user.value.uid), {
                'currentSession.expiresAt': newExpiresAt
            })

            await logAction('session_extended', 'session', sessionId.value)
        } catch (error) {
            console.error('Error extending session:', error)
        }
    }

    const generateSessionId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    const getDeviceInfo = (): string => {
        if (import.meta.client) {
            return navigator.userAgent
        }
        return 'Unknown'
    }

    const formatTimeRemaining = (): string => {
        const ms = timeUntilExpiry.value
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}m ${seconds}s`
    }

    onMounted(() => {
        if (user.value) {
            initSession()
        }
    })

    onUnmounted(() => {
        stopIdleDetection()
        stopSessionCheck()
    })

    return {
        sessionId,
        lastActivity,
        isExpired,
        expiresAt,
        timeUntilExpiry,
        isSessionActive,

        initSession,
        refreshSession,
        endSession,
        extendSession,
        validateSession,
        formatTimeRemaining
    }
}
