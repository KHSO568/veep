import { ref } from 'vue'

export interface RateLimitConfig {
    maxAttempts: number
    windowMs: number
    blockDurationMs: number
}

interface AttemptRecord {
    count: number
    firstAttempt: number
    blockedUntil?: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000
}

export const useRateLimit = (config: Partial<RateLimitConfig> = {}) => {
    const limitConfig = { ...DEFAULT_CONFIG, ...config }
    const attempts = ref<Map<string, AttemptRecord>>(new Map())

    const isLimited = (identifier: string): boolean => {
        const record = attempts.value.get(identifier)
        if (!record) return false

        const now = Date.now()

        if (record.blockedUntil && record.blockedUntil > now) {
            return true
        }

        if (now - record.firstAttempt > limitConfig.windowMs) {
            attempts.value.delete(identifier)
            return false
        }

        return record.count >= limitConfig.maxAttempts
    }

    const recordAttempt = (identifier: string): void => {
        const now = Date.now()
        const record = attempts.value.get(identifier)

        if (!record) {
            attempts.value.set(identifier, {
                count: 1,
                firstAttempt: now
            })
            return
        }

        if (now - record.firstAttempt > limitConfig.windowMs) {
            attempts.value.set(identifier, {
                count: 1,
                firstAttempt: now
            })
            return
        }

        record.count++

        if (record.count >= limitConfig.maxAttempts) {
            record.blockedUntil = now + limitConfig.blockDurationMs
        }

        attempts.value.set(identifier, record)
    }

    const resetAttempts = (identifier: string): void => {
        attempts.value.delete(identifier)
    }

    const getRemainingAttempts = (identifier: string): number => {
        const record = attempts.value.get(identifier)
        if (!record) return limitConfig.maxAttempts

        if (isLimited(identifier)) return 0

        return Math.max(0, limitConfig.maxAttempts - record.count)
    }

    const getTimeUntilUnblocked = (identifier: string): number => {
        const record = attempts.value.get(identifier)
        if (!record || !record.blockedUntil) return 0

        const now = Date.now()
        return Math.max(0, record.blockedUntil - now)
    }

    const formatTimeUntilUnblocked = (identifier: string): string => {
        const ms = getTimeUntilUnblocked(identifier)
        if (ms === 0) return ''

        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)

        if (minutes > 0) {
            return `${minutes} minute(s) ${seconds} second(s)`
        }
        return `${seconds} second(s)`
    }

    const checkAndRecord = (identifier: string): {
        allowed: boolean
        remaining: number
        timeUntilUnblocked?: string
    } => {
        if (isLimited(identifier)) {
            return {
                allowed: false,
                remaining: 0,
                timeUntilUnblocked: formatTimeUntilUnblocked(identifier)
            }
        }

        recordAttempt(identifier)

        return {
            allowed: true,
            remaining: getRemainingAttempts(identifier)
        }
    }

    return {
        isLimited,
        recordAttempt,
        resetAttempts,
        getRemainingAttempts,
        getTimeUntilUnblocked,
        formatTimeUntilUnblocked,
        checkAndRecord
    }
}
