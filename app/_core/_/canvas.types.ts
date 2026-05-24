import type { NodeShapeType } from '@/_core/_/nodeShapeType';
import { NodeParameter } from '@/_core/_/parameter';

export type Position = { x: number; y: number };
export type CanvasItem = Node | Edge;
export type TooltipMode = 'always' | 'hover' | 'never';

export interface Scene {
    kind: 'scene';
    id: string;
    name: string;
    items: CanvasItem[];
    createdAt: Date;
    updatedAt: Date;
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

export interface Edge {
    kind: 'edge';
    id: string;
    from: string;
    to: string;
    color: string;
}
