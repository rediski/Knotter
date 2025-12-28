import type { Edge, Node } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export function createEdge(edges: Edge[], fromNode: Node, toNode: Node): Edge {
    const baseName = 'Связь';
    let name = baseName;
    let counter = 0;

    const existingNames = new Set(edges.map((edge) => edge.name));

    while (existingNames.has(name)) {
        counter++;
        name = `${baseName} ${counter}`;
    }

    return {
        id: uuidv4(),
        name,
        description: '',
        from: fromNode.id,
        to: toNode.id,
        position: {
            x: (fromNode.position.x + toNode.position.x) / 2,
            y: (fromNode.position.y + toNode.position.y) / 2,
        },
        kind: 'edge',
    };
}
