import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  tags: string[];
  editLinkId: string | null;
  qrLinkId: string | null;
}

interface Actions {
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  setEditLinkId: (editLinkId: string | null) => void;
  setQrLinkId: (qrLinkId: string | null) => void;
  clear(): void;
}

const initialState: State = {
  editLinkId: null,
  qrLinkId: null,
  tags: []
};

export const useLinksStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setEditLinkId: (editLinkId) => set({ editLinkId }),
    setQrLinkId: (qrLinkId) => set({ qrLinkId }),
    setTags: (tags) => set({ tags }),
    addTag: (tag) => set({ tags: [...get().tags, tag] }),
    clear: () => set(initialState)
  }))
);
