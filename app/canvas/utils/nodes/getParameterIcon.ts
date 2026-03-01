import { LucideIcon } from 'lucide-react';
import { Hash, Type, FlagTriangleRight, List, Folder, Bug } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    number: Hash,
    string: Type,
    boolean: FlagTriangleRight,
    enum: List,
    structure: Folder,

    bug: Bug,
};

export function getParameterIcon(type: string): LucideIcon {
    return iconMap[type] || iconMap.bug;
}
