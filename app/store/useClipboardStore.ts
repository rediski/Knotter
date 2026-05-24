import { create } from 'zustand';
import type { CanvasItem } from '@/_core/_/canvas.types';

export interface ClipboardState {
    clipboard: CanvasItem[];
    setClipboard: (items: CanvasItem[]) => void;
    clearClipboard: () => void;
}

export const useClipboardStore = create<ClipboardState>()((set) => ({
    clipboard: [],
    setClipboard: (items) => set({ clipboard: items }),
    clearClipboard: () => set({ clipboard: [] }),
}));
