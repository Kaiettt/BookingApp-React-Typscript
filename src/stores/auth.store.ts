import { create } from 'zustand'
import type { LoginResponse } from '@/features/auth/types/login.type'

interface AuthState {
    user: LoginResponse['user'] | null
    isAuthenticated: boolean

    setUser: (user: LoginResponse['user']) => void
    clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user: LoginResponse['user']) =>
        set({
            user,
            isAuthenticated: true,
        }),

    clearUser: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}))
