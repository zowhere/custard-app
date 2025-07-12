import { create } from 'zustand'

export type User = {
    name: string 
}

export interface UserStoreInterface {
    user: User | null,
    updateUser: (data: User) => void
}

export const useUserStore = create<UserStoreInterface>((set) => ({
    user: {
        name: ""
    },
    updateUser: (data: User) => set({ user: {...data} })
}))