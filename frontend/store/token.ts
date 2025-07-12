
import { create } from 'zustand'

export type Token = {
    token: string
}

export interface UserStoreInterface {
    token: Token | null,
    updateToken: (data: Token) => void
}

export const useTokenStore = create<UserStoreInterface>((set) => ({
    token: null,
    updateToken: (data: Token) => set({ token: {...data} }),
}));