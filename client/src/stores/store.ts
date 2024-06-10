import { create } from 'zustand';
import { UserSlice, createUserSlice } from './slices/user.slice';
import { AccountSlice, createAccountSlice } from './slices/account.slice';

export type StoreState = UserSlice & AccountSlice;

export const useStore = create<StoreState>()((set) => ({
  ...createUserSlice(set),
  ...createAccountSlice(set),
}));
