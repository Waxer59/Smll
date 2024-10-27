import { LinkDetails } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  tags: string[];
  links: LinkDetails[];
  editLinkId: string | null;
  qrLinkId: string | null;
}

interface Actions {
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  setEditLinkId: (editLinkId: string | null) => void;
  setQrLinkId: (qrLinkId: string | null) => void;
  setLinks: (links: LinkDetails[]) => void;
  addLink: (link: LinkDetails) => void;
  clear(): void;
}

const initialState: State = {
  editLinkId: null,
  qrLinkId: null,
  tags: [],
  links: []
};

export const useLinksStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setEditLinkId: (editLinkId) => set({ editLinkId }),
    setQrLinkId: (qrLinkId) => set({ qrLinkId }),
    setTags: (tags) => set({ tags }),
    addTag: (tag) => set({ tags: [...get().tags, tag] }),
    clear: () => set(initialState),
    setLinks: (links) => set({ links }),
    addLink: (link) =>
      set((state) => ({
        links: [...state.links, link]
      }))
  }))
);
