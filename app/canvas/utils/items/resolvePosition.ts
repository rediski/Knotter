import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import type { Position } from '@/canvas/_core/_/canvas.types';

import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';
import { useCanvasRefsStore } from '@/canvas/store/useCanvasRefsStore';

export function resolvePosition(): Position {
    const mousePosition = useCanvasRefsStore.getState().mousePosition.current;
    const isMagnet = useCanvasStore.getState().isMagnet;

    if (!mousePosition) {
        return { x: 0, y: 0 };
    }

    return isMagnet
        ? {
              x: Math.round(mousePosition.x / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
              y: Math.round(mousePosition.y / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
          }
        : mousePosition;
}
