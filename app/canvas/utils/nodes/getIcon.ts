import { LucideIcon } from 'lucide-react';
import { Box, Hash, Type, FlagTriangleRight, List, Folder, Bug } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    node: Box,

    number: Hash,
    string: Type,
    boolean: FlagTriangleRight,
    enum: List,
    structure: Folder,

    bug: Bug,
};

export function getIcon(type: string): LucideIcon {
    return iconMap[type] || iconMap.bug;
}
