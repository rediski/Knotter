import type { Node } from '@/canvas/_core/_/canvas.types';
import { v4 as uuidv4 } from 'uuid';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getSnappedPosition } from '@/canvas/utils/items/getSnappedPosition';
import { canAddItem } from '@/canvas/utils/items/canAddItems';
import { generateUniqueName } from '@/canvas/utils/items/generateUniqueName';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { addToHistory } from '@/canvas/utils/clipboard/historyManager'; // Добавить импорт

export function createNode(): Node | null {
    if (!canAddItem()) return null;

    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setItems = itemsState.setItems;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    const nodes = getNodes(items);
    const position = getSnappedPosition();

    const x = Math.round(position.x ?? 0);
    const y = Math.round(position.y ?? 0);

    const baseName = 'Узел';

    const name = generateUniqueName(
        baseName,
        nodes.map((node) => node.name),
    );

    const node: Node = {
        id: uuidv4(),
        name,
        description: '',
        kind: 'node',
        shapeType: 'point',
        position: { x, y },
        edges: [],
        parameters: [],
    };

    addToHistory({
        type: 'ADD_ITEMS',
        items: [structuredClone(node)],
    });

    setItems([...items, node]);
    setSelectedItemIds([node.id]);

    return node;
}
