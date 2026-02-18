import {
    Dot,
    Circle,
    Triangle,
    Square,
    Hexagon,
    Pentagon,
    Octagon,
    Heart,
    HeartMinus,
    HeartPlus,
    Star,
    FlaskConical,
    Bug,
    type LucideIcon,
} from 'lucide-react';

export const NODE_SHAPE_TYPES = [
    'point',
    'circle',
    'triangle',
    'square',
    'pentagon',
    'hexagon',
    'octagon',
    'heart',
    'heartMinus',
    'heartPlus',
    'star',
    'flask',
    'bug',
] as const;

export type NodeShapeType = (typeof NODE_SHAPE_TYPES)[number];

export const NODE_SHAPES: Record<NodeShapeType, { label: string; icon: LucideIcon }> = {
    point: { label: 'Точка', icon: Dot },
    circle: { label: 'Круг', icon: Circle },
    triangle: { label: 'Треугольник', icon: Triangle },
    square: { label: 'Квадрат', icon: Square },
    pentagon: { label: 'Пятиугольник', icon: Pentagon },
    hexagon: { label: 'Шестиугольник', icon: Hexagon },
    octagon: { label: 'Восьмиугольник', icon: Octagon },
    heart: { label: 'Здоровье', icon: Heart },
    heartMinus: { label: 'Урон', icon: HeartMinus },
    heartPlus: { label: 'Лечение', icon: HeartPlus },
    star: { label: 'Звезда', icon: Star },
    flask: { label: 'Колба', icon: FlaskConical },
    bug: { label: 'Жук', icon: Bug },
};

export const DEFAULT_SHAPE = NODE_SHAPES[NODE_SHAPE_TYPES[0]];
