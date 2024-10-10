import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  history: string[];
}

interface Actions {
  setHistory: (history: string[]) => void;
  addHistory: (history: string) => void;
  getPreviousPathname: () => string;
  clear(): void;
}

const initialState: State = {
  history: []
};

export const usePathnameStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setHistory: (history) => set({ history }),
    addHistory: (history) =>
      set((state) => ({ history: [...state.history, history] })),
    getPreviousPathname: () => get().history[get().history.length - 2],
    clear: () => set(initialState)
  }))
);
