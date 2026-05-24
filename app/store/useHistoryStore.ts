import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasAction } from '@/_core/_/history.types';

interface HistoryState {
    history: CanvasAction[];
    historyPosition: number;

    setHistory: (history: CanvasAction[]) => void;
    setHistoryPosition: (position: number) => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            history: [],
            historyPosition: -1,

            setHistory: (history) => set({ history }),
            setHistoryPosition: (position) => set({ historyPosition: position }),
        }),
        {
            name: 'canvas-history',
            partialize: (state) => ({
                history: state.history,
                historyPosition: state.historyPosition,
            }),
        },
    ),
);
