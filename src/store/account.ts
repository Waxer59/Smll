import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  name: string;
  email: string;
  hasEmailVerification: boolean;
  isPasswordlessAccount: boolean;
}

interface Actions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsPasswordlessAccount: (isPasswordlessAccount: boolean) => void;
  setHasEmailVerification: (hasEmailVerification: boolean) => void;
  clear(): void;
}

const initialState: State = {
  name: '',
  email: '',
  isPasswordlessAccount: false,
  hasEmailVerification: true
};

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setIsPasswordlessAccount: (isPasswordlessAccount) =>
      set({ isPasswordlessAccount }),
    setHasEmailVerification: (hasEmailVerification) =>
      set({ hasEmailVerification }),
    clear: () => set(initialState)
  }))
);
