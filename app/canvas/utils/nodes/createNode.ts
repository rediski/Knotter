import type { Node } from '@/canvas/_core/_/canvas.types';
import { v4 as uuidv4 } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { resolvePosition } from '@/canvas/utils/items/resolvePosition';
import { canAddItem } from '@/canvas/utils/items/canAddItem';

export function createNode(): Node | null {
    if (!canAddItem()) return null;

    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    const nodes = getNodes(items);
    const position = resolvePosition();

    const x = position.x ?? 0;
    const y = position.y ?? 0;

    const baseName = 'Узел';
    let name = baseName;

    let counter = 0;

    const existingNames = new Set(nodes.map((node) => node.name));

    while (existingNames.has(name)) {
        counter++;
        name = `${baseName} ${counter}`;
    }

    const node: Node = {
        id: uuidv4(),
        name,
        description: '',
        kind: 'node',
        shapeType: 'point',
        position: { x, y },
        edgeFrom: null,
        edgeTo: null,
        nodeParameters: [],
    };

    setItems([...items, node]);
    setSelectedItemIds([node.id]);

    return node;
}
