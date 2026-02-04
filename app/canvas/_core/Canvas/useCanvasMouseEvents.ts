'use client';

import { useCallback, RefObject, useState } from 'react';
import type { Position } from '@/canvas/_core/_/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useMousePosition } from '@/canvas/_core/Canvas/useMousePosition';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';
import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { getSelectedItemsPositions } from '@/canvas/utils/items/getSelectedItemsPositions';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getTextById } from '@/canvas/utils/texts/getTextById';
import { getTextIdUnderCursor } from '@/canvas/utils/texts/getTextIdUnderCursor';

import { updateHoveredNodeId } from '@/canvas/utils/nodes/updateHoveredNodeId';
import { createEdge } from '@/canvas/utils/edges/createEdge';
import { moveItems } from '@/canvas/utils/items/moveItems';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>, isPanningRef?: RefObject<boolean>) {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const tempEdge = useCanvasStore((state) => state.tempEdge);
    const setMousePosition = useCanvasStore((state) => state.setMousePosition);

    const { trackMousePosition } = useMousePosition();

    const [pendingClickItemId, setPendingClickItemId] = useState<string | null>(null);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<string, Position>>(new Map());

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            if (findCanvasUnderCursor(e, canvas)) return;

            const clickedNodeId = getNodeIdUnderCursor({ x: e.clientX, y: e.clientY });
            const clickedTextId = getTextIdUnderCursor({ x: e.clientX, y: e.clientY });
            const clickedItemId = clickedNodeId || clickedTextId;

            if (clickedNodeId) createEdge(clickedNodeId);

            if (clickedTextId) {
                const textItem = getTextById(items, clickedTextId);
                if (textItem?.isEditing) return;
            }

            if (clickedItemId) {
                const newSelectedIds = selectItems({ itemId: clickedItemId, event: e });
                setSelectedItemIds(newSelectedIds);
            }

            if (!clickedItemId) {
                if (!(e.ctrlKey || e.metaKey || e.shiftKey)) setSelectedItemIds([]);
            }

            setPendingClickItemId(clickedItemId);
            setDragStartMouse(mousePos);
            setInitialNodePositions(getSelectedItemsPositions());
        },
        [canvasRef, items, setSelectedItemIds, trackMousePosition, setMousePosition],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            if (!isPanningRef?.current && !tempEdge && !isDragging) {
                updateHoveredNodeId(e);
            }

            if (isPanningRef?.current || !dragStartMouse || initialNodePositions.size === 0) return;

            setIsDragging(true);

            const dx = mousePos.x - dragStartMouse.x;
            const dy = mousePos.y - dragStartMouse.y;

            setItems(moveItems({ x: dx, y: dy }, initialNodePositions));
        },
        [
            canvasRef,
            isDragging,
            dragStartMouse,
            initialNodePositions,
            setItems,
            trackMousePosition,
            setMousePosition,
            tempEdge,
            isPanningRef,
        ],
    );

    const onMouseUp = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            if (!isDragging && pendingClickItemId) {
                const newSelectedIds = selectItems({ itemId: pendingClickItemId, event: e });
                setSelectedItemIds(newSelectedIds);
            }

            setIsDragging(false);
            setDragStartMouse(null);
            setPendingClickItemId(null);
            setInitialNodePositions(new Map());
        },
        [canvasRef, isDragging, pendingClickItemId, setSelectedItemIds, trackMousePosition, setMousePosition],
    );

    return { onMouseDown, onMouseMove, onMouseUp };
}
