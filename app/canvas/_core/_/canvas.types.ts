import type { NodeShapeType } from '@/canvas/_core/_/nodeShapeType';
import { Parameter } from '@/canvas/_core/_/parameter';

export type Position = { x: number; y: number };

export type CanvasItem = Node | Text | Edge;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface Node {
    id: string;
    name: string;
    description: string;
    kind: 'node';
    shapeType: NodeShapeType;
    position: Position;
    nodeParameters: Parameter[];
}

export interface Edge {
    id: string;
    name: string;
    kind: 'edge';
    from: string;
    to: string;
}

export interface Text {
    id: string;
    name: string;
    kind: 'text';
    content: string;
    position: Position;
    width: number;
    height: number;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
    isEditing: boolean;
}
