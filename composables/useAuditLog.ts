import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore'

export interface AuditLogEntry {
    userId: string
    userEmail: string
    action: string
    resource: string
    resourceId?: string
    timestamp: any
    metadata?: Record<string, any>
    ipAddress?: string
}

export const useAuditLog = () => {
    const { $db } = useNuxtApp()
    const { user } = useAuth()

    /**
     * Log an action to the audit trail
     */
    const logAction = async (
        action: string,
        resource: string,
        resourceId?: string,
        metadata?: Record<string, any>
    ) => {
        if (!user.value) {
            console.warn('Cannot log action: no user authenticated')
            return
        }

        const logEntry: AuditLogEntry = {
            userId: user.value.uid,
            userEmail: user.value.email || 'unknown',
            action,
            resource,
            resourceId,
            timestamp: serverTimestamp(),
            metadata: metadata || {}
        }

        try {
            await addDoc(collection($db, 'audit_logs'), logEntry)
        } catch (error) {
            console.error('Failed to log action:', error)
        }
    }

    /**
     * Get audit logs for a specific user
     */
    const getUserLogs = async (userId: string, limitCount = 50) => {
        try {
            const q = query(
                collection($db, 'audit_logs'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Failed to fetch user logs:', error)
            return []
        }
    }

    /**
     * Get recent audit logs (admin only)
     */
    const getRecentLogs = async (limitCount = 100) => {
        try {
            const q = query(
                collection($db, 'audit_logs'),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Failed to fetch recent logs:', error)
            return []
        }
    }

    /**
     * Get logs for a specific resource
     */
    const getResourceLogs = async (resource: string, resourceId: string, limitCount = 20) => {
        try {
            const q = query(
                collection($db, 'audit_logs'),
                where('resource', '==', resource),
                where('resourceId', '==', resourceId),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Failed to fetch resource logs:', error)
            return []
        }
    }

    return {
        logAction,
        getUserLogs,
        getRecentLogs,
        getResourceLogs
    }
}
