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

export const NODE_SHAPE_TYPES = [
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
] as const;

export type NodeShapeType = (typeof NODE_SHAPE_TYPES)[number];

export const NODE_SHAPES: Record<NodeShapeType, { label: string; icon: LucideIcon }> = {
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

export const DEFAULT_SHAPE = NODE_SHAPES[NODE_SHAPE_TYPES[0]];
