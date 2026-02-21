import type { NodeShapeType } from '@/canvas/_core/_/nodeShapeType';
import { Parameter } from '@/canvas/_core/_/parameter';

export type Position = { x: number; y: number };

export type CanvasItem = Node | Text;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface Edge {
    id: string;
    from: string;
    to: string;
}

export interface Node {
    id: string;
    name: string;
    description: string;
    kind: 'node';
    shapeType: NodeShapeType;
    position: Position;
    edges: Omit<Edge, 'from'>[];
    nodeParameters: Parameter[];
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
