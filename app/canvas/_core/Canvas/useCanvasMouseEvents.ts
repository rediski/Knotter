'use client';

import { useCallback, RefObject, useState } from 'react';

import type { Position } from '@/canvas/_core/_/canvas.types';
import { MIN_DRAG_DISTANCE } from '@/canvas/_core/_/canvas.constants';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useMousePosition } from '@/canvas/_core/Canvas/useMousePosition';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { moveItems } from '@/canvas/utils/items/moveItems';
import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';
import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { getSelectedItemsPositions } from '@/canvas/utils/items/getSelectedItemsPositions';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getTextById } from '@/canvas/utils/texts/getTextById';
import { getTextIdUnderCursor } from '@/canvas/utils/texts/getTextIdUnderCursor';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>, isPanningRef?: RefObject<boolean>) {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const tempEdge = useCanvasStore((state) => state.tempEdge);
    const setTempEdge = useCanvasStore((state) => state.setTempEdge);
    const setMousePosition = useCanvasStore((state) => state.setMousePosition);
    const setHoveredNodeId = useCanvasStore((state) => state.setHoveredNodeId);

    const { trackMousePosition } = useMousePosition();

    const [pendingClickItemId, setPendingClickItemId] = useState<string | null>(null);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<string, Position>>(new Map());

    const updateHoveredNodeId = useCallback(
        (e: MouseEvent) => {
            const hoveredNodeId = getNodeIdUnderCursor({
                x: e.clientX,
                y: e.clientY,
            });

            setHoveredNodeId(hoveredNodeId);
        },
        [setHoveredNodeId],
    );

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;

            if (!canvas || e.button !== 0) return;

            const target = e.target as HTMLElement;

            if (target.closest('[data-interactive-element="true"]')) {
                return;
            }

            const isStandardInteractive =
                target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON';

            if (isStandardInteractive) return;

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            const clickedCanvas = findCanvasUnderCursor(e, canvas);

            if (clickedCanvas) return;

            const clickedNodeId = getNodeIdUnderCursor({
                x: e.clientX,
                y: e.clientY,
            });

            const clickedTextId = getTextIdUnderCursor({
                x: e.clientX,
                y: e.clientY,
            });

            const textItem = getTextById(items, clickedTextId!);

            if (textItem?.isEditing) {
                return;
            }

            const clickedItemId = clickedNodeId || clickedTextId;

            if (!clickedItemId) {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    setSelectedItemIds([]);
                }

                return;
            }

            setPendingClickItemId(clickedItemId);
            setDragStartMouse(mousePos);

            if (selectedItemIds.includes(clickedItemId)) {
                const positions = getSelectedItemsPositions(items, selectedItemIds);
                setInitialNodePositions(positions);
            }

            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                if (!selectedItemIds.includes(clickedItemId)) {
                    setSelectedItemIds([clickedItemId]);
                }
            }
        },
        [canvasRef, items, selectedItemIds, setSelectedItemIds, trackMousePosition, setMousePosition],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;

            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            if (!isPanningRef?.current && !isDraggingNodes && !tempEdge) {
                updateHoveredNodeId(e);
            }

            if (isPanningRef?.current) return;

            if (tempEdge) {
                setTempEdge({ ...tempEdge, toPos: mousePos });
                return;
            }

            if (!isDraggingNodes && pendingClickItemId && dragStartMouse && initialNodePositions.size > 0) {
                const distance = Math.sqrt(
                    Math.pow(mousePos.x - dragStartMouse.x, 2) + Math.pow(mousePos.y - dragStartMouse.y, 2),
                );

                if (distance > MIN_DRAG_DISTANCE) {
                    setIsDraggingNodes(true);
                }
            }

            if (isDraggingNodes && dragStartMouse && initialNodePositions.size > 0) {
                const dx = mousePos.x - dragStartMouse.x;
                const dy = mousePos.y - dragStartMouse.y;

                const updatedItems = moveItems({ x: dx, y: dy }, initialNodePositions);
                setItems(updatedItems);
            }
        },
        [
            canvasRef,
            items,
            selectedItemIds,
            isDraggingNodes,
            pendingClickItemId,
            dragStartMouse,
            initialNodePositions,
            tempEdge,
            setItems,
            setTempEdge,
            trackMousePosition,
            setMousePosition,
            isPanningRef,
            updateHoveredNodeId,
        ],
    );

    const onMouseUp = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;

            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            if (!isDraggingNodes && pendingClickItemId) {
                const newSelectedIds = selectItems({
                    itemId: pendingClickItemId,
                    event: e,
                });

                setSelectedItemIds(newSelectedIds);
            }

            setIsDraggingNodes(false);
            setDragStartMouse(null);
            setPendingClickItemId(null);
            setInitialNodePositions(new Map());
        },
        [
            canvasRef,
            items,
            selectedItemIds,
            pendingClickItemId,
            isDraggingNodes,
            tempEdge,
            setSelectedItemIds,
            setTempEdge,
            setItems,
            trackMousePosition,
            setMousePosition,
        ],
    );

    return { onMouseDown, onMouseMove, onMouseUp };
}
