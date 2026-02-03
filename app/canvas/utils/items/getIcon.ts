import { LucideIcon } from 'lucide-react';
import { Box, Link2, Hash, Type, Feather, FlagTriangleRight, List, Folder, Bug } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    node: Box,
    edge: Link2,

    number: Hash,
    string: Type,
    text: Feather,
    boolean: FlagTriangleRight,
    enum: List,
    structure: Folder,

    bug: Bug,
};

export function getIcon(type: string): LucideIcon {
    return iconMap[type] || iconMap.bug;
}
