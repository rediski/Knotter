'use client';

import { RefObject, useCallback } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useCanvasRefsStore } from '@/canvas/store/canvasRefStore';

import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';

import { updateHoveredNodeId } from '@/canvas/utils/nodes/updateHoveredNodeId';

import { moveItems } from '@/canvas/utils/items/moveItems';
import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { handleClickOnItem } from '@/canvas/utils/items/handleClickOnItem';

import { startDragging, stopDragging } from '@/canvas/utils/canvas/dragging';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const items = useCanvasStore((state) => state.items);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;
            if (findCanvasUnderCursor(e, canvasRef.current)) return;

            handleClickOnItem(e);
            startDragging(e, canvasRef);
        },
        [canvasRef, items, setSelectedItemIds],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const mousePosition = useCanvasRefsStore.getState().mousePosition;

            const isPanning = useCanvasRefsStore.getState().isPanning;
            const isDragging = useCanvasRefsStore.getState().isDragging;
            const dragStartMouse = useCanvasRefsStore.getState().dragStartMouse;
            const initialNodePositions = useCanvasRefsStore.getState().initialNodePositions;

            const tempEdge = useCanvasStore.getState().tempEdge;
            const setItems = useCanvasStore.getState().setItems;

            const mousePos = getMousePosition(e, canvasRef.current);

            mousePosition.current = mousePos;

            if (!isPanning?.current && !tempEdge && !isDragging.current) {
                updateHoveredNodeId(e);
            }

            if (isPanning?.current || !dragStartMouse.current || initialNodePositions.current.size === 0) {
                return;
            }

            isDragging.current = true;

            const dx = mousePos.x - dragStartMouse.current.x;
            const dy = mousePos.y - dragStartMouse.current.y;

            setItems(moveItems({ x: dx, y: dy }, initialNodePositions.current));
        },
        [canvasRef],
    );

    const onMouseUp = useCallback(() => stopDragging(), []);

    return { onMouseDown, onMouseMove, onMouseUp };
}
