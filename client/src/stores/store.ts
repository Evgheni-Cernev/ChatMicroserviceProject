import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/auth.slice';
import { AccountSlice, createAccountSlice } from './slices/account.slice';

export type StoreState = AuthSlice & AccountSlice;

export const useStore = create<StoreState>()((set) => ({
    ...createAuthSlice(set),
    ...createAccountSlice(set),
}));
