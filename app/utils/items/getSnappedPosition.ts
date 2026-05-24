import { useCanvasStore } from '@/store/useCanvasStore';
import type { Position } from '@/_core/_/canvas.types';

import { NODE_MOVE_MAX_STEP } from '@/_core/_/canvas.constants';
import { useCanvasRefsStore } from '@/store/useCanvasRefsStore';

export function snapPosition(position: Position, step: number = NODE_MOVE_MAX_STEP): Position {
    return {
        x: Math.round(position.x / step) * step,
        y: Math.round(position.y / step) * step,
    };
}

export function getSnappedPosition(): Position {
    const mousePosition = useCanvasRefsStore.getState().mousePosition.current;
    const isMagnet = useCanvasStore.getState().isMagnet;

    if (!mousePosition) {
        return { x: 0, y: 0 };
    }

    return isMagnet ? snapPosition(mousePosition, NODE_MOVE_MAX_STEP) : mousePosition;
}
