import type { ParameterType } from '@/_core/_/parameter';
import { Hash, Type, FlagTriangleRight, List, LucideIcon, ScanBox } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    number: Hash,
    string: Type,
    boolean: FlagTriangleRight,
    enum: List,
};

export const getParameterIcon = (type: ParameterType | null): LucideIcon => (type ? iconMap[type] : ScanBox);
