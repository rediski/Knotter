import type { NodeShapeType } from '@/canvas/_core/_/nodeShapeType';
import { NodeParameter } from '@/canvas/_core/_/parameter';

export type Position = { x: number; y: number };

export type CanvasItem = Node | Edge;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface Edge {
    id: string;
    from: string;
    to: string;
    kind: 'edge';
}

export interface Node {
    id: string;
    name: string;
    description: string;
    kind: 'node';
    shapeType: NodeShapeType;
    position: Position;
    parameters: NodeParameter[];
}
