import type { CanvasItem } from '@/canvas/canvas.types';
import type { CreateItemParams } from '@/canvas/utils/items/createItem.types';

import { createNode } from '@/canvas/utils/nodes/createNode';
import { createEdge } from '@/canvas/utils/edges/createEdge';
import { createText } from '@/canvas/utils/texts/createText';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { MAX_CANVAS_ITEMS } from '@/canvas/canvas.constants';

export function createItem(params: CreateItemParams): CanvasItem | null {
    const { items } = useCanvasStore.getState();

    if (items.length >= MAX_CANVAS_ITEMS) {
        console.warn(`Достигнут лимит элементов на канвасе (${MAX_CANVAS_ITEMS}). Новый элемент добавлен не будет.`);
        return null;
    }

    switch (params.type) {
        case 'node':
            return createNode(params.state.nodes, params.position);

        case 'edge':
            return createEdge(params.state.edges, params.fromNode, params.toNode);

        case 'text':
            return createText(params.state.texts, params.content, params.position);
    }
}
