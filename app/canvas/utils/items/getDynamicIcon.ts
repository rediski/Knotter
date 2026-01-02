import { LucideIcon } from 'lucide-react';
import { Box, Link2, Hash, Type, Feather, FlagTriangleRight, List, Brackets, Bug } from 'lucide-react';

const dynamicIconMap: Record<string, LucideIcon> = {
    node: Box,
    edge: Link2,

    number: Hash,
    string: Type,
    text: Feather,
    boolean: FlagTriangleRight,
    enum: List,
    array: Brackets,

    bug: Bug,
};

export function getDynamicIcon(type: string): LucideIcon {
    return dynamicIconMap[type] || dynamicIconMap.bug;
}
