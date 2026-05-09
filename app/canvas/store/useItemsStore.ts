import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasItem, Position } from '@/canvas/_core/_/canvas.types';
import type { Parameter } from '@/canvas/_core/_/parameter';

export interface ItemsState {
    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    hoveredNodeId: string | null;
    setHoveredNodeId: (id: string | null) => void;

    tempEdge: string | null;
    setTempEdge: (id: string | null) => void;

    selectionStart: Position | null;
    setSelectionStart: (pos: Position | null) => void;

    selectionEnd: Position | null;
    setSelectionEnd: (pos: Position | null) => void;

    selectedParameters: Set<string>;
    setSelectedParameters: (selectedParameters: Set<string>) => void;
}

export const useItemsStore = create<ItemsState>()(
    persist(
        (set) => ({
            items: [],
            setItems: (items) => set({ items }),

            parameters: [],
            setParameters: (parameters) => set({ parameters }),

            selectedItemIds: [],
            setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

            hoveredNodeId: null,
            setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),

            tempEdge: null,
            setTempEdge: (tempEdge) => set({ tempEdge }),

            selectionStart: null,
            setSelectionStart: (pos) => set({ selectionStart: pos }),

            selectionEnd: null,
            setSelectionEnd: (pos) => set({ selectionEnd: pos }),

            selectedParameters: new Set<string>(),
            setSelectedParameters: (selectedParameters) => set({ selectedParameters }),
        }),
        {
            name: 'items-storage',
            partialize: (state) => ({
                items: state.items,
                parameters: state.parameters,
                selectedItemIds: state.selectedItemIds,
            }),
        },
    ),
);
