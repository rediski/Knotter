import type { Node, Position } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export function createNode(nodes: Node[], position: Position): Node {
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

    return {
        id: uuidv4(),
        name,
        description: '',
        shapeType: 'point',
        position: { x, y },
        kind: 'node',
        nodeParameters: [],
    };
}
