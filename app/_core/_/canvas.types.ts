import type { NodeShapeType } from '@/_core/_/nodeShapeType';
import type { CanvasAction } from '@/_core/_/history.types';
import { NodeParameter } from '@/_core/_/parameter';

export type Position = { x: number; y: number };
export type CanvasItem = Node | Edge;
export type TooltipMode = 'always' | 'hover' | 'never';

export interface Scene {
    kind: 'scene';
    id: string;
    name: string;
    description: string;
    color: string | null;
    items: CanvasItem[];
    history: CanvasAction[];
    historyPosition: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Node {
    kind: 'node';
    id: string;
    sceneId: string;
    name: string;
    description: string;
    shapeType: NodeShapeType;
    color: string | null;
    position: Position;
    parameters: NodeParameter[];
}

export interface Edge {
    kind: 'edge';
    id: string;
    name: string;
    from: string;
    to: string;
    color: string | null;
}
