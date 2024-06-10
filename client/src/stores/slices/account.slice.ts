export const createAccountSlice = (
  set: (state: Partial<AccountSlice>) => void
) => ({
  profiles: [],
  setProfiles: (newProfiles: []) => set({ profiles: newProfiles }),
});

export type AccountSlice = {
  profiles: string[] | null;
};
