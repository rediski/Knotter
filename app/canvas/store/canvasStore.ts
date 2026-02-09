import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CanvasItem, Position, TooltipMode } from '@/canvas/_core/_/canvas.types';
import type { Parameter } from '@/canvas/_core/_/parameter.types';
import type { SidebarPanel } from '@/canvas/_core/_/sidebarPanel.types';
import { INITIAL_ZOOM } from '@/canvas/_core/_/canvas.constants';

import { v4 as uuid } from 'uuid';

export interface CanvasState {
    offset: Position;
    setOffset: (offset: Position) => void;

    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;

    invertY: boolean;
    setInvertY: (value: boolean) => void;

    // ---

    hoveredNodeId: string | null;
    setHoveredNodeId: (id: string | null) => void;

    tempEdge: string | null;
    setTempEdge: (id: string | null) => void;

    // ---

    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    selectedItem: CanvasItem | null;

    selectionStart: Position | null;
    setSelectionStart: (pos: Position | null) => void;

    selectionEnd: Position | null;
    setSelectionEnd: (pos: Position | null) => void;

    // ---

    clipboard: CanvasItem[];
    setClipboard: (items: CanvasItem[]) => void;

    // ---

    tooltipMode: TooltipMode;
    setTooltipMode: (tooltipMode: TooltipMode) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;

    // ---

    selectedTabId: string | null;
    setSelectedTabId: (nodeId: string | null) => void;

    openedTabIds: string[];
    setOpenedTabIds: (nodeIds: string[]) => void;

    // ---

    sidebarPanels: SidebarPanel[];
    setSidebarPanels: (panels: SidebarPanel[]) => void;

    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;

    filterText: Record<string, string>;
    setFilterText: (panelId: string, text: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            offset: { x: 0, y: 0 },
            setOffset: (offset) => set({ offset }),

            zoomLevel: INITIAL_ZOOM,
            setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

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

            selectionStart: null,
            setSelectionStart: (pos) => set({ selectionStart: pos }),

            selectionEnd: null,
            setSelectionEnd: (pos) => set({ selectionEnd: pos }),

            // ---

            clipboard: [],
            setClipboard: (items) => set({ clipboard: items }),

            // ---

            tooltipMode: 'always',
            setTooltipMode: (tooltipMode) => set({ tooltipMode }),

            isMagnet: false,
            setIsMagnet: (value) => set({ isMagnet: value }),

            showGrid: true,
            toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

            showAxes: false,
            toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),

            // ---
            selectedTabId: null,
            setSelectedTabId: (selectedTabId) => set({ selectedTabId }),

            openedTabIds: [],
            setOpenedTabIds: (openedTabIds) => set({ openedTabIds }),

            // ---

            sidebarWidth: 380,
            setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

            sidebarPanels: [
                { id: uuid(), type: 'hierarchy' },
                { id: uuid(), type: 'inspector' },
            ],
            setSidebarPanels: (sidebarPanels) => set({ sidebarPanels }),

            filterText: {},
            setFilterText: (panelId, text) =>
                set((state) => ({
                    filterText: {
                        ...state.filterText,
                        [panelId]: text,
                    },
                })),
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                offset: state.offset,
                zoomLevel: state.zoomLevel,
                invertY: state.invertY,

                items: state.items,
                parameters: state.parameters,
                selectedItemIds: state.selectedItemIds,
                selectedItem: state.selectedItem,

                tooltipMode: state.tooltipMode,
                isMagnet: state.isMagnet,
                showGrid: state.showGrid,
                showAxes: state.showAxes,

                selectedTabId: state.selectedTabId,
                openedTabIds: state.openedTabIds,

                sidebarWidth: state.sidebarWidth,
                sidebarPanels: state.sidebarPanels,
                filterText: state.filterText,
            }),
        },
    ),
);
