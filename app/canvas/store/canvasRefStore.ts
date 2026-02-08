import { create } from 'zustand';
import type { Position } from '@/canvas/_core/_/canvas.types';

type CanvasRefsStore = {
    mousePosition: { current: Position };
    dragStartMouse: { current: Position | null };
    lastMouseRef: { current: Position | null };
    isDragging: { current: boolean };
    isPanning: { current: boolean };
    initialNodePositions: { current: Map<string, Position> };
};

export const useCanvasRefsStore = create<CanvasRefsStore>(() => ({
    mousePosition: { current: { x: 0, y: 0 } },
    dragStartMouse: { current: null },
    lastMouseRef: { current: null },
    isDragging: { current: false },
    isPanning: { current: false },
    initialNodePositions: { current: new Map() },
}));
