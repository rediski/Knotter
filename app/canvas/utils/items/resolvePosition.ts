import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { Position } from '@/canvas/_core/_/canvas.types';

import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

export function resolvePosition(): Position {
    const mousePosition = useCanvasStore.getState().mousePosition;
    const isMagnet = useCanvasStore.getState().isMagnet;

    return isMagnet
        ? {
              x: Math.round(mousePosition.x / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
              y: Math.round(mousePosition.y / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
          }
        : mousePosition;
}
