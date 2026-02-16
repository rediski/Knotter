import type { ShapeType } from '@/canvas/_core/_/shapeType.type';
import { Parameter } from '@/canvas/_core/_/parameter.types';

export type Position = { x: number; y: number };

export type CanvasItem = Node | Text | Edge;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface Node {
    id: string;
    name: string;
    description: string;
    kind: 'node';
    shapeType: ShapeType;
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
