import { create } from "zustand";

interface PanelState {
  leftOpen: boolean;
  rightOpen: boolean;

  openLeft: () => void;
  closeLeft: () => void;

  openRight: () => void;
  closeRight: () => void;

  toggleLeft: () => void;
  toggleRight: () => void;
}

export const usePanelStore = create<PanelState>((set, get) => ({
  leftOpen: true,
  rightOpen: false,

  openLeft: () =>
    set({
      leftOpen: true,
      rightOpen: false,
    }),

  closeLeft: () =>
    set({
      leftOpen: false,
    }),

  openRight: () =>
    set({
      rightOpen: true,
      leftOpen: false,
    }),

  closeRight: () =>
    set({
      rightOpen: false,
    }),

  toggleLeft: () => {
    const { leftOpen } = get();

    if (leftOpen) {
      set({ leftOpen: false });
    } else {
      set({
        leftOpen: true,
        rightOpen: false,
      });
    }
  },

  toggleRight: () => {
    const { rightOpen } = get();

    if (rightOpen) {
      set({ rightOpen: false });
    } else {
      set({
        rightOpen: true,
        leftOpen: false,
      });
    }
  },
}));