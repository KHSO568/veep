import { ref } from 'vue'

interface ToastOptions {
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
}

// Global state for toast instance
let toastInstance: any = null

export const setToastInstance = (instance: any) => {
    toastInstance = instance
}

export const useToast = () => {
    const showToast = (options: ToastOptions) => {
        if (toastInstance) {
            toastInstance.addToast(options)
        } else {
            console.warn('Toast instance not initialized')
        }
    }

    const success = (message: string, duration?: number) => {
        showToast({ type: 'success', message, duration })
    }

    const error = (message: string, duration?: number) => {
        showToast({ type: 'error', message, duration })
    }

    const warning = (message: string, duration?: number) => {
        showToast({ type: 'warning', message, duration })
    }

    const info = (message: string, duration?: number) => {
        showToast({ type: 'info', message, duration })
    }

    return {
        showToast,
        success,
        error,
        warning,
        info
    }
}
