import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CanvasItem, Position, TooltipMode, EditorMode } from '@/canvas/canvas.types';
import type { SidebarPanel } from '@/canvas/components/CanvasSidebar/_sidebarPanel.types';
import type { Parameter } from '@/canvas/utils/parameters/parameter.types';

import { INITIAL_ZOOM } from '@/canvas/canvas.constants';

export interface CanvasState {
    offset: Position;
    setOffset: (offset: Position) => void;

    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;

    mousePosition: Position;
    setMousePosition: (pos: Position) => void;

    invertY: boolean;
    setInvertY: (value: boolean) => void;

    // ---

    hoveredNodeId: string | null;
    setHoveredNodeId: (id: string | null) => void;

    tempEdge: { from: string; toPos: Position } | null;
    setTempEdge: (edge: { from: string; toPos: Position } | null) => void;

    // ---

    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    selectedItem: CanvasItem | null;

    // ---

    tooltipMode: TooltipMode;
    setTooltipMode: (tooltipMode: TooltipMode) => void;

    editorMode: EditorMode;
    setEditorMode: (editorMode: EditorMode) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;

    // ---

    sidebarPanels: SidebarPanel[];
    setSidebarPanels: (panels: SidebarPanel[]) => void;
    setPanelHeight: (id: string, height: number) => void;

    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            offset: { x: 0, y: 0 },
            setOffset: (offset) => set({ offset }),

            zoomLevel: INITIAL_ZOOM,
            setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

            mousePosition: { x: 0, y: 0 },
            setMousePosition: (mousePosition) => set({ mousePosition }),

            invertY: true,
            setInvertY: (value) => set({ invertY: value }),

            // ---

            hoveredNodeId: null,
            setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),

            tempEdge: null,
            setTempEdge: (tempEdge) => set({ tempEdge }),

            // ---

            items: [],
            setItems: (items) =>
                set({
                    items,
                    selectedItem:
                        get().selectedItemIds.length > 0
                            ? (items.find((item) => item.id === get().selectedItemIds[0]) ?? null)
                            : null,
                }),

            parameters: [],
            setParameters: (parameters) => set({ parameters }),

            selectedItemIds: [],
            setSelectedItemIds: (ids) =>
                set({
                    selectedItemIds: ids,
                    selectedItem: ids.length > 0 ? (get().items.find((item) => item.id === ids[0]) ?? null) : null,
                }),

            selectedItem: null,

            // ---

            tooltipMode: 'always',
            setTooltipMode: (tooltipMode) => set({ tooltipMode }),

            editorMode: 'edit',
            setEditorMode: (editorMode) => set({ editorMode }),

            isMagnet: false,
            setIsMagnet: (value) => set({ isMagnet: value }),

            showGrid: true,
            toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

            showAxes: false,
            toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),

            sidebarPanels: [],

            setSidebarPanels: (sidebarPanels) => set({ sidebarPanels }),

            setPanelHeight: (id, height) =>
                set((state) => ({
                    sidebarPanels: state.sidebarPanels.map((panel) => (panel.id === id ? { ...panel, height } : panel)),
                })),

            sidebarWidth: 380,
            setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                offset: state.offset,
                zoomLevel: state.zoomLevel,
                invertY: state.invertY,

                // ---

                items: state.items,
                parameters: state.parameters,
                selectedItemIds: state.selectedItemIds,
                selectedItem: state.selectedItem,

                // ---

                editorMode: state.editorMode,
                tooltipMode: state.tooltipMode,
                isMagnet: state.isMagnet,
                showGrid: state.showGrid,
                showAxes: state.showAxes,

                sidebarPanels: state.sidebarPanels,
                sidebarWidth: state.sidebarWidth,
            }),
        },
    ),
);
