import type { NodeShapeType } from '@/canvas/_core/_/nodeShapeType';
import { NodeParameter } from '@/canvas/_core/_/parameter';

export type Position = { x: number; y: number };

export type CanvasItem = Node | Edge;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface Edge {
    kind: 'edge';
    id: string;
    from: string;
    to: string;
}

export interface Node {
    kind: 'node';
    id: string;
    name: string;
    description: string;
    shapeType: NodeShapeType;
    color: string;
    position: Position;
    parameters: NodeParameter[];
}
