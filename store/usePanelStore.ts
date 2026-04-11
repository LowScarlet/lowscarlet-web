import { ReactNode } from "react";
import { create } from "zustand";

interface PanelState {
  leftOpen: boolean;
  rightOpen: boolean;

  leftTitle: ReactNode | null;
  rightTitle: ReactNode | null;

  leftContext: ReactNode | null;
  rightContext: ReactNode | null;

  openLeft: (payload?: { title?: ReactNode; content?: ReactNode }) => void;
  closeLeft: () => void;

  openRight: (payload?: { title?: ReactNode; content?: ReactNode }) => void;
  closeRight: () => void;

  toggleLeft: () => void;
  toggleRight: () => void;
}

export const usePanelStore = create<PanelState>((set, get) => ({
  leftOpen: false,
  rightOpen: false,

  leftTitle: null,
  rightTitle: null,

  leftContext: null,
  rightContext: null,

  openLeft: (payload) =>
    set({
      leftOpen: true,
      rightOpen: false,
      leftTitle: payload?.title ?? get().leftTitle,
      leftContext: payload?.content ?? get().leftContext,
    }),

  closeLeft: () =>
    set({
      leftOpen: false,
    }),

  openRight: (payload) =>
    set({
      rightOpen: true,
      leftOpen: false,
      rightTitle: payload?.title ?? get().rightTitle,
      rightContext: payload?.content ?? get().rightContext,
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
      set({ leftOpen: true, rightOpen: false });
    }
  },

  toggleRight: () => {
    const { rightOpen } = get();

    if (rightOpen) {
      set({ rightOpen: false });
    } else {
      set({ rightOpen: true, leftOpen: false });
    }
  },
}));