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
import { addToHistory } from '@/canvas/utils/clipboard/historyManager';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const isCanvasUnderCursor = findCanvasUnderCursor(e, canvasRef.current);

            const itemsState = useItemsStore.getState();

            const tempEdge = itemsState.tempEdge;
            const setTempEdge = itemsState.setTempEdge;

            if (tempEdge && isCanvasUnderCursor) {
                setTempEdge(null);
                return;
            }

            if (isCanvasUnderCursor) return;

            handleClickOnItem(e, isCanvasUnderCursor);
            startDragging(e, canvasRef);
        },
        [canvasRef],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const refsState = useCanvasRefsStore.getState();

            const mousePosition = refsState.mousePosition;
            const isPanning = refsState.isPanning;
            const isDragging = refsState.isDragging;
            const dragStartMouse = refsState.dragStartMouse;
            const initialNodePositions = refsState.initialNodePositions;

            const itemsState = useItemsStore.getState();

            const tempEdge = itemsState.tempEdge;
            const setItems = itemsState.setItems;

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

    const onMouseUp = useCallback(() => {
        const refsState = useCanvasRefsStore.getState();
        const itemsState = useItemsStore.getState();

        const initialNodePositions = refsState.initialNodePositions;
        const items = itemsState.items;
        const selectedItemIds = itemsState.selectedItemIds;

        const movedItems = items.filter((item) => selectedItemIds.includes(item.id));

        const changedItems = movedItems.filter((item) => {
            const initialPos = initialNodePositions.current.get(item.id);
            return initialPos && (initialPos.x !== item.position.x || initialPos.y !== item.position.y);
        });

        if (changedItems.length > 0) {
            addToHistory({
                type: 'MOVE_ITEMS',
                items: structuredClone(changedItems),
            });
        }

        stopDragging();
    }, []);

    return { onMouseDown, onMouseMove, onMouseUp };
}
