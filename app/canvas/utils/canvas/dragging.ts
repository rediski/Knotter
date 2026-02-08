import { RefObject } from 'react';

import { useCanvasRefsStore } from '@/canvas/store/canvasRefStore';

import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { getSelectedItemsPositions } from '@/canvas/utils/items/getSelectedItemsPositions';

export function startDragging(e: MouseEvent, canvasRef: RefObject<HTMLCanvasElement | null>) {
    if (!canvasRef.current) return;

    const mousePos = getMousePosition(e, canvasRef.current);

    const isDragging = useCanvasRefsStore.getState().isDragging;
    const dragStartMouse = useCanvasRefsStore.getState().dragStartMouse;
    const initialNodePositions = useCanvasRefsStore.getState().initialNodePositions;

    dragStartMouse.current = mousePos;
    initialNodePositions.current = getSelectedItemsPositions();
    isDragging.current = false;
}

export function stopDragging() {
    const isDragging = useCanvasRefsStore.getState().isDragging;
    const dragStartMouse = useCanvasRefsStore.getState().dragStartMouse;
    const initialNodePositions = useCanvasRefsStore.getState().initialNodePositions;

    isDragging.current = false;
    dragStartMouse.current = null;
    initialNodePositions.current = new Map();
}
