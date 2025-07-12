import { create } from "zustand";

export type Business = {
  businessName: string;
  businessType: string;
  businessAddress: string;
  businesswebsite?: string;
  businessDescription: string;
};

export interface UserStoreInterface {
  business: Business | null;
  updateBusiness: (data: Business) => void;
}

export const useBusinessStore = create<UserStoreInterface>((set) => ({
  business: null,
  updateBusiness: (data: Business) => set({ business: { ...data } }),
}));
