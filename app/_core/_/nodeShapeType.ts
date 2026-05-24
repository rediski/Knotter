import {
    Dot,
    Circle,
    Triangle,
    Square,
    Hexagon,
    Pentagon,
    Octagon,
    Diamond,
    Heart,
    Star,
    type LucideIcon,
} from 'lucide-react';

export const NODE_SHAPE_TYPES = [
    'point',
    'circle',
    'triangle',
    'diamond',
    'square',
    'pentagon',
    'hexagon',
    'octagon',
    'heart',
    'star',
] as const;

export type NodeShapeType = (typeof NODE_SHAPE_TYPES)[number];

export const NODE_SHAPES: Record<NodeShapeType, { label: string; icon: LucideIcon }> = {
    point: { label: 'Точка', icon: Dot },
    circle: { label: 'Круг', icon: Circle },
    triangle: { label: 'Треугольник', icon: Triangle },
    diamond: { label: 'Ромб', icon: Diamond },
    square: { label: 'Квадрат', icon: Square },
    pentagon: { label: 'Пятиугольник', icon: Pentagon },
    hexagon: { label: 'Шестиугольник', icon: Hexagon },
    octagon: { label: 'Восьмиугольник', icon: Octagon },
    heart: { label: 'Сердце', icon: Heart },
    star: { label: 'Звезда', icon: Star },
};

export const DEFAULT_SHAPE = NODE_SHAPES[NODE_SHAPE_TYPES[0]];
