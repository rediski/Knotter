import { useRef } from 'react';

import type { CanvasState, Position, Edge } from '@/canvas/canvas.types';

import { NodeShapeType } from '@/canvas/utils/nodes/getShape';

import { NODE_MOVE_MAX_STEP } from '@/canvas/canvas.constants';

import { useCanvasHistory } from '@/canvas/hooks/useCanvasHistory';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { toggleMagnetMode } from '@/canvas/utils/canvas/toggleMagnetMode';
import { toggleTooltipMode } from '@/canvas/utils/canvas/toggleTooltipMode';

import { createItem } from '@/canvas/utils/items/createItem';
import { deleteItems } from '@/canvas/utils/items/deleteItems';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getSelectedNodes } from '@/canvas/utils/nodes/getSelectedNodes';

import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getSelectedEdges } from '@/canvas/utils/edges/getSelectedEdges';

import { getSelectedTexts } from '@/canvas/utils/texts/getSelectedTexts';
import { getTexts } from '@/canvas/utils/texts/getTexts';

import { v4 as uuidv4 } from 'uuid';

export function useCanvasHandlers() {
    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const mousePosition = useCanvasStore((state) => state.mousePosition);
    const isMagnet = useCanvasStore((state) => state.isMagnet);
    const setItems = useCanvasStore((state) => state.setItems);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setTempEdge = useCanvasStore((state) => state.setTempEdge);
    const toggleGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleAxes = useCanvasStore((state) => state.toggleShowAxes);

    const clipboardRef = useRef<CanvasState>({ nodes: [], edges: [], texts: [] });

    const { pushHistory } = useCanvasHistory();

    return {
        toggleTooltipMode,
        toggleMagnetMode,
        toggleGrid,
        toggleAxes,

        delete: () => {
            const newItems = deleteItems(items, selectedItemIds);
            setItems(newItems);
        },

        selectAll: () => setSelectedItemIds(items.map((i) => i.id)),
        selectAllNodes: () => setSelectedItemIds(items.filter((i) => i.kind === 'node').map((n) => n.id)),
        selectAllEdges: () => setSelectedItemIds(items.filter((i) => i.kind === 'edge').map((e) => e.id)),

        copy: () => {
            clipboardRef.current = {
                nodes: getSelectedNodes(items, selectedItemIds),
                edges: getSelectedEdges(items, selectedItemIds),
                texts: getSelectedTexts(items, selectedItemIds),
            };
        },

        paste: () => {
            const { nodes, edges, texts } = clipboardRef.current;
            if (!nodes.length) return;

            pushHistory();

            const insertionGap = NODE_MOVE_MAX_STEP;

            const newNodes = nodes.map((node) => ({
                ...node,
                id: uuidv4(),
                position: {
                    x: node.position.x + insertionGap,
                    y: node.position.y + insertionGap,
                },
            }));

            const nodeIdMap = new Map(nodes.map((node, i) => [node.id, newNodes[i].id]));

            const newEdges = edges
                .map((edge) => {
                    const fromId = nodeIdMap.get(edge.from);
                    const toId = nodeIdMap.get(edge.to);
                    if (!fromId || !toId) return null;
                    return {
                        ...edge,
                        id: uuidv4(),
                        from: fromId,
                        to: toId,
                    };
                })
                .filter((e): e is Edge => e !== null);

            const newTexts = texts.map((t) => ({
                ...t,
                id: uuidv4(),
                position: {
                    x: t.position.x + insertionGap,
                    y: t.position.y + insertionGap,
                },
            }));

            setItems([...items, ...newNodes, ...newEdges, ...newTexts]);
            setSelectedItemIds(newNodes.map((n) => n.id));
        },

        addNode: () => {
            pushHistory();

            const adjustedMousePosition = isMagnet
                ? {
                      x: Math.round(mousePosition.x / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
                      y: Math.round(mousePosition.y / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
                  }
                : mousePosition;

            const newNode = createItem({
                type: 'node',
                state: { nodes: getNodes(items) },
                position: adjustedMousePosition,
            });

            if (!newNode) return;

            setItems([...items, newNode]);
            setSelectedItemIds([newNode.id]);
        },

        startEdge: () => {
            if (!setTempEdge || selectedItemIds.length === 0) return;

            const nodes = getNodes(items);
            const fromNode = nodes.find((n) => n.id === selectedItemIds[0]);

            if (!fromNode) return;

            setTempEdge({ from: fromNode.id, toPos: { ...fromNode.position } });
        },

        addText: (content: string = '') => {
            pushHistory();

            const adjustedMousePosition = isMagnet
                ? {
                      x: Math.round(mousePosition.x / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
                      y: Math.round(mousePosition.y / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP,
                  }
                : mousePosition;

            const newText = createItem({
                type: 'text',
                state: { texts: getTexts(items) },
                content,
                position: adjustedMousePosition,
            });

            if (!newText) return;

            setItems([...items, newText]);
            setSelectedItemIds([newText.id]);
        },

        moveSelection: (dx: number, dy: number) => {
            if (selectedItemIds.length === 0) return;

            pushHistory();

            const nodes = getNodes(items);
            const edges = getEdges(items);

            const initialPositions = new Map<string, Position>();

            nodes.forEach((node) => {
                if (selectedItemIds.includes(node.id)) {
                    initialPositions.set(node.id, { ...node.position });
                }
            });

            const movedNodes = moveNodes({ x: dx, y: dy }, initialPositions);

            setItems([...movedNodes, ...edges]);
        },

        changeNodeShapeType: (nodeIds: string[], newShape: NodeShapeType) => {
            pushHistory();

            const updatedItems = items.map((i) =>
                i.kind === 'node' && nodeIds.includes(i.id) ? { ...i, shapeType: newShape } : i,
            );

            setItems(updatedItems);
        },
    };
}
