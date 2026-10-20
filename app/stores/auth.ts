import { defineStore } from 'pinia'
import type { UserLoginDto } from '~/interfaces/user-login-dto'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | {
            id: number
            email: string
            role: string
        },
        initialized: false
    }),

    actions: {
        async fetchUser() {
            this.user = await $fetch<{
                id: number
                email: string
                role: string
            }>('/api/auth/me', {
                headers: useRequestHeaders(['cookie'])
            })
        },

        async login(form: UserLoginDto) {
            try {
                this.user = await $fetch<any>('/api/auth/login', {
                    method: 'POST',
                    body: form
                })
            } catch (error: any) {
                return error.data?.message
            }
        },

        async logout() {
            await $fetch('/api/auth/logout', {
                method: 'POST'
            })

            this.user = null
        }
    }
})