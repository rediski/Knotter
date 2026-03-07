import { create } from 'zustand';
import type { CanvasAction } from '@/canvas/_core/_/clipboard.types';

interface HistoryState {
    history: CanvasAction[];
    historyPosition: number;

    setHistory: (history: CanvasAction[]) => void;
    setHistoryPosition: (position: number) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
    history: [],
    historyPosition: -1,

    setHistory: (history) => set({ history }),
    setHistoryPosition: (position) => set({ historyPosition: position }),
}));
