import type { ParameterType } from '@/_core/_/parameter';
import { Sigma, Type, FlagTriangleRight, List, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    number: Sigma,
    string: Type,
    boolean: FlagTriangleRight,
    enum: List,
};

export function getParameterIcon(type: ParameterType): LucideIcon {
    return iconMap[type] || iconMap.bug;
}
