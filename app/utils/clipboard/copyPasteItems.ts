import { v4 as uuid } from 'uuid';
import type { CanvasItem, Edge, Node } from '@/_core/_/canvas.types';
import { NODE_MOVE_MAX_STEP } from '@/_core/_/canvas.constants';

import { useItemsStore } from '@/store/useItemsStore';
import { useClipboardStore } from '@/store/useClipboardStore';

import { canAddItems } from '@/utils/items/canAddItems';
import { addToHistory } from '@/utils/history/historyManager';
import { getSelectedNodes } from '@/utils/nodes/getSelectedNodes';
import { getSelectedEdges } from '@/utils/edges/getSelectedEdges';

function getRelatedNodes(items: CanvasItem[], selectedIds: string[]): { nodes: Node[]; edges: Edge[] } {
    const selectedSet = new Set(selectedIds);
    const nodesToCopy: Node[] = [];
    const edgesToCopy: Edge[] = [];

    const selectedNodes = getSelectedNodes();
    const selectedEdges = getSelectedEdges();

    const connectedNodeIds = new Set<string>();

    selectedEdges.forEach((edge) => {
        connectedNodeIds.add(edge.from);
        connectedNodeIds.add(edge.to);
    });

    const connectedNodes = items.filter(
        (item): item is Node => item.kind === 'node' && connectedNodeIds.has(item.id) && !selectedSet.has(item.id),
    );

    if (connectedNodes.length > 0) {
        nodesToCopy.push(...connectedNodes);

        const connectedNodeIdsSet = new Set([...selectedNodes.map((n) => n.id), ...connectedNodes.map((n) => n.id)]);

        const additionalEdges = items.filter(
            (item): item is Edge =>
                item.kind === 'edge' &&
                connectedNodeIdsSet.has(item.from) &&
                connectedNodeIdsSet.has(item.to) &&
                !selectedSet.has(item.id),
        );

        edgesToCopy.push(...additionalEdges);
    }

    nodesToCopy.push(...selectedNodes);
    edgesToCopy.push(...selectedEdges);

    return { nodes: nodesToCopy, edges: edgesToCopy };
}

export function copySelectedItems(items: CanvasItem[], selectedIds: string[]) {
    const setClipboard = useClipboardStore.getState().setClipboard;

    const { nodes, edges } = getRelatedNodes(items, selectedIds);
    const snapshot = [...nodes, ...edges].map((item) => structuredClone(item));

    setClipboard(snapshot);
}

function generateNewIds(items: CanvasItem[]): Map<string, string> {
    const map = new Map<string, string>();
    items.forEach((item) => map.set(item.id, uuid()));

    return map;
}

export function pasteClipboardItems() {
    const clipboardState = useClipboardStore.getState();
    const { currentSceneId, scenes } = useItemsStore.getState();

    const clipboard = clipboardState.clipboard;

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const setSelectedItemIds = useItemsStore.getState().setSelectedItemIds;

    if (!clipboard.length || !canAddItems(clipboard.length)) return;

    const newIds = generateNewIds(clipboard);

    const nodeIdMap = new Map<string, string>();

    clipboard.forEach((item) => {
        if (item.kind === 'node') {
            const newId = newIds.get(item.id);
            if (newId) nodeIdMap.set(item.id, newId);
        }
    });

    const newItems: CanvasItem[] = [];

    clipboard.forEach((item) => {
        if (item.kind === 'node') {
            const newId = newIds.get(item.id)!;
            const clone = structuredClone(item) as Node;

            clone.id = newId;
            clone.position = {
                x: clone.position.x + NODE_MOVE_MAX_STEP,
                y: clone.position.y + NODE_MOVE_MAX_STEP,
            };

            newItems.push(clone);
        }
    });

    clipboard.forEach((item) => {
        if (item.kind === 'edge') {
            const newId = newIds.get(item.id)!;
            const clone = structuredClone(item) as Edge;

            clone.id = newId;

            const newFromId = nodeIdMap.get(clone.from);
            const newToId = nodeIdMap.get(clone.to);

            if (newFromId && newToId) {
                clone.from = newFromId;
                clone.to = newToId;
                newItems.push(clone);
            }
        }
    });

    if (newItems.length === 0) return;

    addToHistory({
        type: 'PASTE_ITEMS',
        items: structuredClone(newItems),
        timestamp: Date.now(),
    });

    const updatedItems = [...items, ...newItems];

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }

    setSelectedItemIds(newItems.map((item) => item.id));
}
