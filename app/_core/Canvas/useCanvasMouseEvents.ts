'use client';

import { RefObject, useCallback } from 'react';

import { useItemsStore } from '@/store/useItemsStore';
import { useCanvasRefsStore } from '@/store/useCanvasRefsStore';

import { findCanvasUnderCursor } from '@/utils/canvas/findCanvasUnderCursor';

import { updateHoveredNodeId } from '@/utils/nodes/updateHoveredNodeId';

import { moveNodes } from '@/utils/nodes/moveNodes';
import { getSelectedNodes } from '@/utils/nodes/getSelectedNodes';
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

            const { tempEdge, currentSceneId, scenes, setScenes } = itemsState;

            const scene = currentSceneId ? scenes[currentSceneId] : null;

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

            const newItems = moveNodes({ x: dx, y: dy }, initialNodePositions.current);

            if (currentSceneId && scene) {
                const updatedScene = {
                    ...scene,
                    items: newItems,
                    updatedAt: new Date(),
                };

                setScenes({ ...scenes, [currentSceneId]: updatedScene });
            }
        },
        [canvasRef, refsState, itemsState],
    );

    const onMouseUp = useCallback(() => {
        const initialNodePositions = refsState.initialNodePositions;
        const selectedNodes = getSelectedNodes();

        const changedNodes = selectedNodes.filter((node) => {
            if (node.kind !== 'node') return null;

            const initialPos = initialNodePositions.current.get(node.id);

            return initialPos && (initialPos.x !== node.position.x || initialPos.y !== node.position.y);
        });

        if (changedNodes.length > 0) {
            addToHistory({
                type: 'MOVE_ITEMS',
                items: structuredClone(changedNodes),
            });
        }

        stopDragging();
    }, [refsState]);

    return { onMouseDown, onMouseMove, onMouseUp };
}
