import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  name: string;
  avatarUrl: string;
}

interface Actions {
  setName: (name: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  clear(): void;
}

const initialState: State = {
  name: '',
  avatarUrl: ''
};

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setName: (name) => set({ name }),
    setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
    clear: () => set(initialState)
  }))
);
