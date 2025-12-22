import { type NodeShapeType } from '@/canvas/utils/nodes/getShape';
import { Parameter } from '@/canvas/utils/parameters/parameter.types';

export type MouseHandler = (e: MouseEvent) => void;

export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
    texts: TextElement[];
}

export type EditorMode = 'edit' | 'view';

export type CanvasItem = Node | Edge | TextElement;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface DrawOptions {
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    cornerRadius?: number;
}

export interface Node {
    id: string;
    name: string;
    description: string;
    shapeType: NodeShapeType;
    width?: number;
    height?: number;
    position: Position;
    kind: 'node';
    nodeParameters: Parameter[];
}

export interface Edge {
    id: string;
    name: string;
    description: string;
    from: string;
    to: string;
    position: Position;
    kind: 'edge';
}

export interface TextElement {
    id: string;
    content: string;
    width?: number;
    height?: number;
    position: Position;
    textAlign?: 'left' | 'center' | 'right';
    isEditing?: boolean;
    kind: 'text';
}
