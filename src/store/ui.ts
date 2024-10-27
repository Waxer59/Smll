import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isNewLinkModalOpen: boolean;
}

interface Actions {
  setIsNewLinkModalOpen: (isNewLinkModalOpen: boolean) => void;
  clear(): void;
}

const initialState: State = {
  isNewLinkModalOpen: false
};

export const useUiStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setIsNewLinkModalOpen: (isNewLinkModalOpen) => set({ isNewLinkModalOpen }),
    clear: () => set(initialState)
  }))
);
