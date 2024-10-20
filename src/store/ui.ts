import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  editLinkId: string | null;
  qrLinkId: string | null;
}

interface Actions {
  setEditLinkId: (editLinkId: string | null) => void;
  setQrLinkId: (qrLinkId: string | null) => void;
  clear(): void;
}

const initialState: State = {
  editLinkId: null,
  qrLinkId: null
};

export const useUiStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setEditLinkId: (editLinkId) => set({ editLinkId }),
    setQrLinkId: (qrLinkId) => set({ qrLinkId }),
    clear: () => set(initialState)
  }))
);
