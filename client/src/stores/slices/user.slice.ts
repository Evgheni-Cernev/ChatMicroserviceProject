export const createUserSlice = (set: (state: Partial<UserSlice>) => void) => ({
  token: null,
  username: null,
  email: null,
  id: null,
  publicKey: null,
  privateKey: null,
  setToken: (newToken: string) => set({ token: newToken }),
  setUserInfo: ({
    id,
    email,
    username,
    publicKey,
    privateKey,
  }: {
    id: number;
    email: string;
    username: string;
    publicKey: string;
    privateKey: string;
  }) => set({ id, email, username, publicKey, privateKey }),
});

export type UserSlice = UserState & UserAction;

export type UserState = {
  id: number | null;
  email: string | null;
  username: string | null;
  publicKey: string | null;
  privateKey: string | null;
  token: string | null;
};

export type UserAction = {
  setToken: (newToken: string) => void;
  setUserInfo: (userInfo: {
    id: number;
    email: string;
    username: string;
    publicKey: string;
    privateKey: string;
  }) => void;
};
