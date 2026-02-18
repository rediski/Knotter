import { DEFAULT_SHAPE, NODE_SHAPES, type NodeShapeType } from '@/canvas/_core/_/nodeShapeType.type';

export function getShape(type?: NodeShapeType | string) {
    if (!type || !(type in NODE_SHAPES)) {
        return DEFAULT_SHAPE;
    }

    return NODE_SHAPES[type as NodeShapeType];
}

export function getAllShapes(): NodeShapeType[] {
    return Object.keys(NODE_SHAPES) as NodeShapeType[];
}
