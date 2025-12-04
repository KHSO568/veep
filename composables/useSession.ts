import { ref, computed, onMounted, onUnmounted } from 'vue'
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore'

export interface SessionConfig {
    timeout: number // in milliseconds
    idleTimeout: number // in milliseconds
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
    timeout: 24 * 60 * 60 * 1000, // 24 hours
    idleTimeout: 30 * 60 * 1000, // 30 minutes
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

    // Calculate when session expires
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

    /**
     * Initialize session tracking
     */
    const initSession = async () => {
        if (!user.value) return

        try {
            // Generate unique session ID
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

            // Store session in Firestore (under user document)
            await updateDoc(doc($db, 'users', user.value.uid), {
                currentSession: sessionData,
                lastActivity: serverTimestamp()
            })

            await logAction('session_started', 'session', sessionId.value)

            // Start idle detection
            startIdleDetection()
            startSessionCheck()
        } catch (error) {
            console.error('Error initializing session:', error)
        }
    }

    /**
     * Refresh session activity
     */
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

    /**
     * End current session
     */
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

    /**
     * Start idle detection
     */
    const startIdleDetection = () => {
        if (import.meta.client) {
            // Track user activity
            const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']

            const handleActivity = () => {
                lastActivity.value = Date.now()
                refreshSession()
            }

            activityEvents.forEach(event => {
                window.addEventListener(event, handleActivity)
            })

            // Check for idle timeout
            idleTimer.value = setInterval(() => {
                if (timeUntilExpiry.value === 0) {
                    handleIdleTimeout()
                }
            }, 10000) // Check every 10 seconds
        }
    }

    /**
     * Stop idle detection
     */
    const stopIdleDetection = () => {
        if (idleTimer.value) {
            clearInterval(idleTimer.value)
            idleTimer.value = null
        }
    }

    /**
     * Start periodic session validation
     */
    const startSessionCheck = () => {
        if (import.meta.client) {
            checkTimer.value = setInterval(() => {
                validateSession()
            }, 60000) // Check every minute
        }
    }

    /**
     * Stop session validation
     */
    const stopSessionCheck = () => {
        if (checkTimer.value) {
            clearInterval(checkTimer.value)
            checkTimer.value = null
        }
    }

    /**
     * Validate session is still valid
     */
    const validateSession = async () => {
        if (!user.value) return

        try {
            // In a real implementation, verify session with server
            // For now, just check local expiry
            if (timeUntilExpiry.value === 0) {
                await handleIdleTimeout()
            }
        } catch (error) {
            console.error('Error validating session:', error)
        }
    }

    /**
     * Handle idle timeout
     */
    const handleIdleTimeout = async () => {
        isExpired.value = true
        await logAction('session_expired', 'session', sessionId.value, {
            reason: 'idle_timeout'
        })

        // Redirect to login or show modal
        if (import.meta.client) {
            alert('Your session has expired due to inactivity. Please log in again.')
            window.location.href = '/'
        }
    }

    /**
     * Extend session
     */
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

    /**
     * Generate unique session ID
     */
    const generateSessionId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * Get device information
     */
    const getDeviceInfo = (): string => {
        if (import.meta.client) {
            return navigator.userAgent
        }
        return 'Unknown'
    }

    /**
     * Format time remaining
     */
    const formatTimeRemaining = (): string => {
        const ms = timeUntilExpiry.value
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}m ${seconds}s`
    }

    // Lifecycle
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
        // State
        sessionId,
        lastActivity,
        isExpired,
        expiresAt,
        timeUntilExpiry,
        isSessionActive,

        // Methods
        initSession,
        refreshSession,
        endSession,
        extendSession,
        validateSession,
        formatTimeRemaining
    }
}
