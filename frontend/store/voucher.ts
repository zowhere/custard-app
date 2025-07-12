import { create } from 'zustand'

export type Voucher = {
    voucherID: string,
    name: string,
    description: string
    value: string,
    category: string,
    type: string,
    onchain: false,
    pointsCost: number,
    maxRedemptions: number,
    isActive: boolean
}

export interface VoucherStoreInterface {
    vouchers: Voucher[],
    updateVoucher: (data: Voucher[]) => void
}

export const useVoucherStore = create<VoucherStoreInterface>((set) => ({
    vouchers: [],
    updateVoucher: (data: Voucher[]) =>{
        set({ vouchers: data })
    }
}))