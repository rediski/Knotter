import { CanvasState, CanvasItem, Node, Edge, Position } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';
import { MAX_CANVAS_ITEMS } from '@/canvas/canvas.constants';

type AddItemParams =
    | { type: 'node'; state: CanvasState; position?: Position }
    | { type: 'edge'; state: CanvasState; fromNode: Node; toNode: Node; position?: Position };

export function handleAddItem(params: AddItemParams): CanvasItem | null {
    const { state } = params;
    const { nodes, edges } = state;

    const totalCount = nodes.length + edges.length;

    if (totalCount >= MAX_CANVAS_ITEMS) {
        console.warn(`Достигнут лимит элементов на канвасе (${MAX_CANVAS_ITEMS}). Новый элемент добавлен не будет.`);

        return null;
    }

    if (params.type === 'node') {
        const step = 10;
        let x = params.position?.x ?? 0;
        let y = params.position?.y ?? 0;

        if (!params.position) {
            while (nodes.some((n) => n.position.x === x && n.position.y === y)) {
                x += step;
                y += step;
            }
        }

        const baseName = 'Узел';
        let name = baseName;
        let counter = 0;

        const existingNames = new Set(nodes.map((n) => n.name));

        while (existingNames.has(name)) {
            counter++;
            name = `${baseName} (${counter})`;
        }

        const newNode: Node = {
            id: uuidv4(),
            name,
            description: '',
            shapeType: 'point',
            position: { x, y },
            kind: 'node',
            nodeParameters: [],
        };

        return newNode;
    }

    if (params.type === 'edge') {
        const { fromNode, toNode } = params;

        const baseName = 'Связь';

        let name = baseName;
        let counter = 0;

        const existingNames = new Set(edges.map((e) => e.name));

        while (existingNames.has(name)) {
            counter++;
            name = `${baseName} (${counter})`;
        }

        const newEdge: Edge = {
            id: uuidv4(),
            name,
            description: '',
            from: fromNode.id,
            to: toNode.id,
            position: params.position ?? {
                x: (fromNode.position.x + toNode.position.x) / 2,
                y: (fromNode.position.y + toNode.position.y) / 2,
            },
            kind: 'edge',
        };

        return newEdge;
    }

    return null;
}
