import { defineStore } from 'pinia'
import type { UserLoginDto } from '~/interfaces/user-login-dto'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | {
            id: number
            email: string
            role: string
        }
    }),

    actions: {
        async fetchUser() {
            this.user = await $fetch<any>('/api/auth/me')
        },

        async login(form: UserLoginDto) {
            this.user = await $fetch<any>('/api/auth/login', {
                method: 'POST',
                body: form
            })
        },

        async logout() {
            await $fetch('/api/auth/logout', {
                method: 'POST'
            })

            this.user = null
        }
    }
})