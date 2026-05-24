import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Position, TooltipMode } from '@/_core/_/canvas.types';

import { INITIAL_ZOOM } from '@/_core/_/canvas.constants';

export interface CanvasState {
    offset: Position;
    setOffset: (offset: Position) => void;

    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;

    invertY: boolean;
    setInvertY: (value: boolean) => void;

    tooltipMode: TooltipMode;
    setTooltipMode: (tooltipMode: TooltipMode) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set) => ({
            offset: { x: 0, y: 0 },
            setOffset: (offset) => set({ offset }),

            zoomLevel: INITIAL_ZOOM,
            setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

            invertY: true,
            setInvertY: (value) => set({ invertY: value }),

            tooltipMode: 'always',
            setTooltipMode: (tooltipMode) => set({ tooltipMode }),

            isMagnet: false,
            setIsMagnet: (value) => set({ isMagnet: value }),

            showGrid: true,
            toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

            showAxes: false,
            toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                offset: state.offset,
                zoomLevel: state.zoomLevel,
                invertY: state.invertY,

                tooltipMode: state.tooltipMode,
                isMagnet: state.isMagnet,
                showGrid: state.showGrid,
                showAxes: state.showAxes,
            }),
        },
    ),
);
