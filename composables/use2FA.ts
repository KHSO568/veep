import { ref } from 'vue'
import * as OTPAuth from 'otplib'
import QRCode from 'qrcode'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

export interface TwoFactorData {
    enabled: boolean
    secret?: string
    backupCodes?: string[]
    enrolledAt?: any
}

export const use2FA = () => {
    const { $db } = useNuxtApp()
    const { user } = useAuth()
    const { logAction } = useAuditLog()

    const isEnrolling = ref(false)
    const qrCodeUrl = ref('')
    const secret = ref('')
    const backupCodes = ref<string[]>([])

    const generateSecret = async () => {
        if (!user.value) throw new Error('User not authenticated')

        try {
            isEnrolling.value = true

            const newSecret = OTPAuth.authenticator.generateSecret()
            secret.value = newSecret

            const otpauthUrl = OTPAuth.authenticator.keyuri(
                user.value.email || user.value.uid,
                'Veep Admin',
                newSecret
            )

            qrCodeUrl.value = await QRCode.toDataURL(otpauthUrl)

            backupCodes.value = generateBackupCodes()

            return {
                secret: newSecret,
                qrCodeUrl: qrCodeUrl.value,
                backupCodes: backupCodes.value
            }
        } catch (error) {
            console.error('Error generating 2FA secret:', error)
            throw error
        }
    }

    const verifyToken = (token: string, secretToVerify?: string): boolean => {
        const secretToUse = secretToVerify || secret.value
        if (!secretToUse) return false

        try {
            return OTPAuth.authenticator.verify({
                token: token.replace(/\s/g, ''),
                secret: secretToUse
            })
        } catch (error) {
            console.error('Error verifying token:', error)
            return false
        }
    }

    const verifyBackupCode = async (code: string): Promise<boolean> => {
        if (!user.value) return false

        try {
            const userDoc = await getDoc(doc($db, 'users', user.value.uid))
            if (!userDoc.exists()) return false

            const userData = userDoc.data()
            const twoFactorData: TwoFactorData = userData.twoFactor || {}

            if (!twoFactorData.backupCodes) return false

            const codeIndex = twoFactorData.backupCodes.indexOf(code)
            if (codeIndex === -1) return false

            twoFactorData.backupCodes.splice(codeIndex, 1)

            await updateDoc(doc($db, 'users', user.value.uid), {
                'twoFactor.backupCodes': twoFactorData.backupCodes
            })

            await logAction('2fa_backup_code_used', 'user', user.value.uid)

            return true
        } catch (error) {
            console.error('Error verifying backup code:', error)
            return false
        }
    }

    const enable2FA = async (token: string): Promise<boolean> => {
        if (!user.value) throw new Error('User not authenticated')
        if (!secret.value) throw new Error('No secret generated')

        if (!verifyToken(token)) {
            throw new Error('Invalid verification code')
        }

        try {
            const twoFactorData: TwoFactorData = {
                enabled: true,
                secret: secret.value,
                backupCodes: backupCodes.value,
                enrolledAt: new Date()
            }

            await updateDoc(doc($db, 'users', user.value.uid), {
                twoFactor: twoFactorData
            })

            await logAction('2fa_enabled', 'user', user.value.uid)

            isEnrolling.value = false
            return true
        } catch (error) {
            console.error('Error enabling 2FA:', error)
            throw error
        }
    }

    const disable2FA = async (password: string): Promise<boolean> => {
        if (!user.value) throw new Error('User not authenticated')

        try {

            await updateDoc(doc($db, 'users', user.value.uid), {
                'twoFactor.enabled': false
            })

            await logAction('2fa_disabled', 'user', user.value.uid)

            return true
        } catch (error) {
            console.error('Error disabling 2FA:', error)
            throw error
        }
    }

    const check2FAStatus = async (userId: string): Promise<TwoFactorData | null> => {
        try {
            const userDoc = await getDoc(doc($db, 'users', userId))
            if (!userDoc.exists()) return null

            const userData = userDoc.data()
            return userData.twoFactor || null
        } catch (error) {
            console.error('Error checking 2FA status:', error)
            return null
        }
    }

    const generateBackupCodes = (count: number = 10): string[] => {
        const codes: string[] = []
        for (let i = 0; i < count; i++) {
            const code = Array.from({ length: 8 }, () =>
                Math.floor(Math.random() * 10)
            ).join('')
            codes.push(code)
        }
        return codes
    }

    const regenerateBackupCodes = async (): Promise<string[]> => {
        if (!user.value) throw new Error('User not authenticated')

        try {
            const newCodes = generateBackupCodes()

            await updateDoc(doc($db, 'users', user.value.uid), {
                'twoFactor.backupCodes': newCodes
            })

            await logAction('2fa_backup_codes_regenerated', 'user', user.value.uid)

            backupCodes.value = newCodes
            return newCodes
        } catch (error) {
            console.error('Error regenerating backup codes:', error)
            throw error
        }
    }

    return {
        isEnrolling,
        qrCodeUrl,
        secret,
        backupCodes,

        generateSecret,
        verifyToken,
        verifyBackupCode,
        enable2FA,
        disable2FA,
        check2FAStatus,
        regenerateBackupCodes
    }
}
