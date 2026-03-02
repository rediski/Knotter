'use client';

import { RefObject, useCallback } from 'react';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useCanvasRefsStore } from '@/canvas/store/useCanvasRefsStore';

import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';

import { updateHoveredNodeId } from '@/canvas/utils/nodes/updateHoveredNodeId';

import { moveItems } from '@/canvas/utils/items/moveItems';
import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { handleClickOnItem } from '@/canvas/utils/items/handleClickOnItem';

import { startDragging, stopDragging } from '@/canvas/utils/items/dragItems';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const isCanvasUnderCursor = findCanvasUnderCursor(e, canvasRef.current);
            if (isCanvasUnderCursor) return;

            handleClickOnItem(e, isCanvasUnderCursor);
            startDragging(e, canvasRef);
        },
        [canvasRef],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const mousePosition = useCanvasRefsStore.getState().mousePosition;

            const isPanning = useCanvasRefsStore.getState().isPanning;
            const isDragging = useCanvasRefsStore.getState().isDragging;
            const dragStartMouse = useCanvasRefsStore.getState().dragStartMouse;
            const initialNodePositions = useCanvasRefsStore.getState().initialNodePositions;

            const tempEdge = useItemsStore.getState().tempEdge;
            const setItems = useItemsStore.getState().setItems;

            const mousePos = getMousePosition(e, canvasRef.current);

            mousePosition.current = mousePos;

            if (!isPanning?.current && !tempEdge && !isDragging.current) {
                updateHoveredNodeId(e);
            }

            const isLeftMouseButtonPressed = e.buttons === 1;

            const hasNodesToMove = initialNodePositions.current.size > 0;
            const isCurrentlyPanning = isPanning?.current;

            if (!isLeftMouseButtonPressed || isCurrentlyPanning || !hasNodesToMove) {
                return;
            }

            isDragging.current = true;

            if (!dragStartMouse.current) return;

            const dx = mousePos.x - dragStartMouse.current.x;
            const dy = mousePos.y - dragStartMouse.current.y;

            setItems(moveItems({ x: dx, y: dy }, initialNodePositions.current));
        },
        [canvasRef],
    );

    const onMouseUp = useCallback(() => stopDragging(), []);

    return { onMouseDown, onMouseMove, onMouseUp };
}
