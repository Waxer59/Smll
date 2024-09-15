import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  name: string;
  email: string;
  isFirstTimeUser: boolean;
}

interface Actions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsFirstTimeUser: (isFirstTimeUser: boolean) => void;
  clear(): void;
}

const initialState: State = {
  name: '',
  email: '',
  isFirstTimeUser: false
};

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setIsFirstTimeUser: (isFirstTimeUser) => set({ isFirstTimeUser }),
    clear: () => set(initialState)
  }))
);
