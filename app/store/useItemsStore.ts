import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, Position } from '@/_core/_/canvas.types';
import type { Parameter } from '@/_core/_/parameter';

export interface ItemsState {
    scenes: Record<string, Scene>;
    setScenes: (scenes: Record<string, Scene>) => void;

    currentSceneId: string | null;
    setCurrentSceneId: (id: string | null) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    currentNodeId: string | null;
    setCurrentNodeIds: (id: string | null) => void;

    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;

    selectedParameterIds: string[];
    setSelectedParameterIds: (selectedParameterIds: string[]) => void;

    hoveredNodeId: string | null;
    setHoveredNodeId: (id: string | null) => void;

    tempEdge: string | null;
    setTempEdge: (id: string | null) => void;

    selectionStart: Position | null;
    setSelectionStart: (pos: Position | null) => void;

    selectionEnd: Position | null;
    setSelectionEnd: (pos: Position | null) => void;
}

export const useItemsStore = create<ItemsState>()(
    persist(
        (set) => ({
            selectedItemIds: [],
            setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

            scenes: {},
            setScenes: (scenes) => set({ scenes }),

            currentSceneId: null,
            setCurrentSceneId: (id) => set({ currentSceneId: id }),

            currentNodeId: null,
            setCurrentNodeIds: (currentNodeId) => set({ currentNodeId }),

            parameters: [],
            setParameters: (parameters) => set({ parameters }),

            selectedParameterIds: [],
            setSelectedParameterIds: (selectedParameterIds) => set({ selectedParameterIds }),

            hoveredNodeId: null,
            setHoveredNodeId: (id) => set({ hoveredNodeId: id }),

            tempEdge: null,
            setTempEdge: (tempEdge) => set({ tempEdge }),

            selectionStart: null,
            setSelectionStart: (pos) => set({ selectionStart: pos }),

            selectionEnd: null,
            setSelectionEnd: (pos) => set({ selectionEnd: pos }),
        }),
        {
            name: 'items-storage',

            partialize: (state) => ({
                scenes: state.scenes,
                currentSceneId: state.currentSceneId,
                selectedItemIds: state.selectedItemIds,
                parameters: state.parameters,
                selectedParameterIds: state.selectedParameterIds,
            }),
        },
    ),
);
