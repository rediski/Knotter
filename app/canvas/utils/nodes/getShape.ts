import type { ShapeType } from '@/canvas/_core/_/shapeType.type';

import {
    Circle,
    Square,
    Triangle,
    Hexagon,
    Octagon,
    Diamond,
    Dot,
    X,
    Club,
    Heart,
    Spade,
    Pentagon,
    type LucideIcon,
} from 'lucide-react';

export const NODE_SHAPE_TYPES: ShapeType[] = [
    'triangle',
    'circle',
    'x',
    'square',
    'spade',
    'heart',
    'diamond',
    'club',
    'point',
    'pentagon',
    'hexagon',
    'octagon',
];

const SHAPES: Record<ShapeType, { label: string; icon: LucideIcon }> = {
    triangle: { label: 'Треугольник', icon: Triangle },
    circle: { label: 'Круг', icon: Circle },
    x: { label: 'Крест', icon: X },
    square: { label: 'Квадрат', icon: Square },
    spade: { label: 'Пики', icon: Spade },
    heart: { label: 'Червы', icon: Heart },
    diamond: { label: 'Бубны', icon: Diamond },
    club: { label: 'Трефы', icon: Club },
    point: { label: 'Точка', icon: Dot },
    pentagon: { label: 'Пятиугольник', icon: Pentagon },
    hexagon: { label: 'Шестиугольник', icon: Hexagon },
    octagon: { label: 'Восьмиугольник', icon: Octagon },
};

const DEFAULT_SHAPE = SHAPES[NODE_SHAPE_TYPES[0]];

export function getShape(type?: ShapeType | string) {
    if (!type || !(type in SHAPES)) {
        return DEFAULT_SHAPE;
    }

    return SHAPES[type as ShapeType];
}

export function getAllShapes(): ShapeType[] {
    return Object.keys(SHAPES) as ShapeType[];
}
