'use client';

import { useCallback, RefObject, useState } from 'react';

import { Position } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useMousePosition } from '@/canvas/hooks/useMousePosition';

import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { findNodeUnderCursor } from '@/canvas/utils/nodes/findNodeUnderCursor';
import { findEdgeUnderCursor } from '@/canvas/utils/edges/findEdgeUnderCursor';
import { selectCanvasItem } from '@/canvas/utils/items/selectCanvasItem';
import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getSelectedNodesPositions } from '@/canvas/utils/nodes/getSelectedNodesPositions';
import { handleAddItem } from '@/canvas/utils/items/handleAddItem';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>, isPanningRef?: RefObject<boolean>) {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const nodeMoveStep = useCanvasStore((state) => state.nodeMoveStep);
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
        (mousePos: Position) => {
            const nodes = getNodes(items);
            const hoveredNode = findNodeUnderCursor(nodes, mousePos);
            setHoveredNodeId(hoveredNode?.id || null);
        },
        [items, setHoveredNodeId],
    );

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;

            if (!canvas || e.button !== 0) return;

            const target = e.target as HTMLElement;

            const isStandardInteractive =
                target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON';

            if (isStandardInteractive) {
                return;
            }

            const mousePos = getMousePosition(e, canvas);
            trackMousePosition(mousePos, setMousePosition);

            const nodes = getNodes(items);
            const edges = getEdges(items);

            const clickedNode = findNodeUnderCursor(nodes, mousePos);
            const clickedEdge = !clickedNode ? findEdgeUnderCursor(edges, nodes, mousePos) : null;

            if (!clickedNode && !clickedEdge) return;

            const clickedItemId = (clickedNode || clickedEdge)!.id;

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
                updateHoveredNodeId(mousePos);
            }

            if (isPanningRef?.current) return;

            const nodes = getNodes(items);

            if (tempEdge) {
                setTempEdge({ ...tempEdge, toPos: mousePos });
                return;
            }

            if (!isDraggingNodes && pendingClickItemId && dragStartMouse) {
                setIsDraggingNodes(true);
                setInitialNodePositions(getSelectedNodesPositions(nodes, selectedItemIds));
            }

            if (isDraggingNodes && dragStartMouse) {
                const dx = mousePos.x - dragStartMouse.x;
                const dy = mousePos.y - dragStartMouse.y;

                const updatedNodes = moveNodes(nodes, selectedItemIds, initialNodePositions, { x: dx, y: dy }, nodeMoveStep);

                setItems(
                    items.map((item) =>
                        item.kind === 'node' && selectedItemIds.includes(item.id)
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
            nodeMoveStep,
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

                const targetNode = findNodeUnderCursor(nodes, mousePos);
                const edgeExists = targetNode
                    ? edges.some((edge) => edge.from === tempEdge.from && edge.to === targetNode.id)
                    : true;

                if (targetNode && targetNode.id !== tempEdge.from && !edgeExists) {
                    const fromNode = nodes.find((n) => n.id === tempEdge.from);

                    if (fromNode) {
                        const newEdge = handleAddItem({
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
