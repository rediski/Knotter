import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, CanvasItem, Position } from '@/canvas/_core/_/canvas.types';
import type { Parameter } from '@/canvas/_core/_/parameter';

export interface ItemsState {
    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    scenes: Map<string, Scene>;
    setScenes: (scenes: Map<string, Scene>) => void;

    activeSceneId: string | null;
    setActiveSceneId: (id: string | null) => void;

    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;

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

            selectedItemIds: [],
            setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

            scenes: new Map(),
            setScenes: (scenes) => set({ scenes }),

            activeSceneId: null,
            setActiveSceneId: (id) => set({ activeSceneId: id }),

            parameters: [],
            setParameters: (parameters) => set({ parameters }),

            hoveredNodeId: null,
            setHoveredNodeId: (id) => set({ hoveredNodeId: id }),

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
                scenes: Array.from(state.scenes.entries()),
                parameters: state.parameters,
                selectedItemIds: state.selectedItemIds,
            }),

            onRehydrateStorage: () => (state) => {
                if (state && Array.isArray(state.scenes)) {
                    state.scenes = new Map(state.scenes);
                }
            },
        },
    ),
);
