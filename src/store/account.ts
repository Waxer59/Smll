import { LinkDetails, TokenDetails } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  name: string;
  email: string;
  tokens: TokenDetails[];
  hasEmailVerification: boolean;
  hasMFA: boolean;
  isPasswordlessAccount: boolean;
}

interface Actions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsPasswordlessAccount: (isPasswordlessAccount: boolean) => void;
  setHasEmailVerification: (hasEmailVerification: boolean) => void;
  setTokens: (tokens: TokenDetails[]) => void;
  addToken: (token: TokenDetails) => void;
  deleteToken: (token: string) => void;
  setHasMFA: (hasMFA: boolean) => void;
  clear(): void;
}

const initialState: State = {
  name: '',
  email: '',
  hasMFA: false,
  isPasswordlessAccount: false,
  hasEmailVerification: true,
  tokens: []
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
    setHasMFA: (hasMFA) => set({ hasMFA }),
    setTokens: (tokens) => set({ tokens }),
    addToken: (token) =>
      set((state) => ({
        tokens: [...state.tokens, token]
      })),
    deleteToken: (token) =>
      set((state) => ({
        tokens: state.tokens.filter(({ token: t }) => t !== token)
      })),
    clear: () => set(initialState)
  }))
);
