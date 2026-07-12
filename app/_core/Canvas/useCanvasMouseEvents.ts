'use client';

import { RefObject, useCallback } from 'react';

import { useItemsStore } from '@/store/useItemsStore';
import { useCanvasRefsStore } from '@/store/useCanvasRefsStore';

import { findCanvasUnderCursor } from '@/utils/canvas/findCanvasUnderCursor';

import { updateHoveredNodeId } from '@/utils/nodes/updateHoveredNodeId';

import { changeNodePositions } from '@/utils/nodes/changeNodePosition';
import { getMovedNodes } from '@/utils/nodes/getMovedNodes';
import { getMousePosition } from '@/utils/canvas/getMousePosition';
import { handleClickOnItem } from '@/utils/items/handleClickOnItem';

import { startDragging, stopDragging } from '@/utils/items/dragItems';
import { addToHistory } from '@/utils/history/historyManager';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const itemsState = useItemsStore();
    const refsState = useCanvasRefsStore();

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const isCanvasUnderCursor = findCanvasUnderCursor(e, canvasRef.current);

            const { tempEdge, setTempEdge } = itemsState;

            if (tempEdge && isCanvasUnderCursor) {
                setTempEdge(null);
                return;
            }

            if (isCanvasUnderCursor) return;

            handleClickOnItem(e, isCanvasUnderCursor);
            startDragging(e, canvasRef);
        },
        [canvasRef, itemsState],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const mousePosition = refsState.mousePosition;
            const isPanning = refsState.isPanning;
            const isDragging = refsState.isDragging;
            const dragStartMouse = refsState.dragStartMouse;
            const initialNodePositions = refsState.initialNodePositions;

            const { tempEdge } = itemsState;

            const mousePos = getMousePosition(e, canvasRef.current);

            mousePosition.current = mousePos;

            if (!isPanning?.current && !tempEdge && !isDragging.current) {
                updateHoveredNodeId(e);
            }

            const isLeftMouseButtonPressed = e.buttons === 1;

            const hasNodesToMove = initialNodePositions.current.size > 0;
            const isCurrentlyPanning = isPanning?.current;

            if (!isLeftMouseButtonPressed || isCurrentlyPanning || !hasNodesToMove) return;

            isDragging.current = true;

            if (!dragStartMouse.current) return;

            const dx = mousePos.x - dragStartMouse.current.x;
            const dy = mousePos.y - dragStartMouse.current.y;

            const updates = Array.from(initialNodePositions.current.entries()).map(([nodeId, initialPos]) => ({
                nodeId,
                newPosition: {
                    x: initialPos.x + dx,
                    y: initialPos.y + dy,
                },
            }));

            changeNodePositions(updates);
        },
        [canvasRef, refsState, itemsState],
    );

    const onMouseUp = useCallback(() => {
        const initialPositions = refsState.initialNodePositions.current;
        const movedNodes = getMovedNodes(initialPositions);

        if (movedNodes.length > 0) {
            addToHistory({
                type: 'CHANGE_ITEMS',
                items: structuredClone(movedNodes),
            });
        }

        stopDragging();
    }, [refsState.initialNodePositions]);

    return { onMouseDown, onMouseMove, onMouseUp };
}
