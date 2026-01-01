'use client';

import { useCallback, RefObject, useState } from 'react';

import type { Position } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useMousePosition } from '@/canvas/hooks/useMousePosition';

import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';

import { selectCanvasItem } from '@/canvas/utils/items/selectItem';
import { createItem } from '@/canvas/utils/items/createItem';
import { moveItems } from '@/canvas/utils/items/moveItems';
import { getSelectedItemsPositions } from '@/canvas/utils/items/getSelectedItemsPositions';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';

import { getEdges } from '@/canvas/utils/edges/getEdges';

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

            if (!clickedTextId) return;

            const textItem = getTextById(items, clickedTextId);

            if (textItem?.isEditing) {
                return;
            }

            const clickedItemId = clickedNodeId || clickedTextId;

            if (!clickedItemId) return;

            setPendingClickItemId(clickedItemId);
            setDragStartMouse(mousePos);

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

            if (!isDraggingNodes && pendingClickItemId && dragStartMouse) {
                setIsDraggingNodes(true);
                setInitialNodePositions(getSelectedItemsPositions(items, selectedItemIds));
            }

            if (isDraggingNodes && dragStartMouse) {
                const dx = mousePos.x - dragStartMouse.x;
                const dy = mousePos.y - dragStartMouse.y;

                const updatedNodes = moveItems({ x: dx, y: dy }, initialNodePositions);

                setItems(
                    items.map((item) =>
                        item.kind !== 'edge' && selectedItemIds.includes(item.id)
                            ? (updatedNodes.find((n) => n.id === item.id) ?? item)
                            : item,
                    ),
                );
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
                const newSelectedIds = selectCanvasItem({
                    items,
                    selectedIds: selectedItemIds,
                    itemId: pendingClickItemId,
                    event: e,
                });

                setSelectedItemIds(newSelectedIds);
            }

            if (tempEdge) {
                const nodes = getNodes(items);
                const edges = getEdges(items);

                const targetNodeId = getNodeIdUnderCursor({
                    x: e.clientX,
                    y: e.clientY,
                });

                const targetNode = nodes.find((n) => n.id === targetNodeId) ?? null;

                const edgeExists = targetNode
                    ? edges.some((edge) => edge.from === tempEdge.from && edge.to === targetNode.id)
                    : true;

                if (targetNode && targetNode.id !== tempEdge.from && !edgeExists) {
                    const fromNode = nodes.find((n) => n.id === tempEdge.from);

                    if (fromNode) {
                        const newEdge = createItem({
                            type: 'edge',
                            state: { nodes, edges },
                            fromNode,
                            toNode: targetNode,
                        });

                        if (newEdge) setItems([...items, newEdge]);
                    }
                }

                setTempEdge(null);
            }

            setIsDraggingNodes(false);
            setDragStartMouse(null);
            setPendingClickItemId(null);
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
