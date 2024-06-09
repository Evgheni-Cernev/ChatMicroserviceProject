export const createAuthSlice = (set: (state: Partial<AuthSlice>) => void) => ({
  token: null,
  userName: null,
  email: null,
  id: null,
  setToken: (newToken: string) => set({ token: newToken }),
});

export type AuthSlice = AuthState & AuthAction;

export type AuthState = {
  token: string | null;
  userName: string | null;
  email: string | null;
  id: string | null;
};

export type AuthAction = {
  setToken: (newToken: string) => void;
};
