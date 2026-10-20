
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: number
    type: ToastType
    message: string
    duration: number
}

export const useToast = () => {
    const toasts = useState<Toast[]>('toasts', () => [])

    const remove = (id: number) => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    const add = (
        type: ToastType,
        message: string,
        duration = 4000,
    ) => {
        const id = Date.now() + Math.random()

        toasts.value.push({ id, type, message, duration })

        if (duration > 0 && import.meta.client) {
            setTimeout(() => remove(id), duration)
        }

        return id
    }

    return {
        toasts,
        success: (message: string, duration?: number) =>
            add('success', message, duration),
        error: (message: string, duration?: number) =>
            add('error', message, duration),
        warning: (message: string, duration?: number) =>
            add('warning', message, duration),
        info: (message: string, duration?: number) =>
            add('info', message, duration),
        remove,
    }
}
