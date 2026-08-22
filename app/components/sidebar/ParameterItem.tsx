'use client';

import { memo, useCallback, type MouseEvent } from 'react';

import type { Parameter } from '@/_core/_/parameter';
import { getParameterIcon } from '@/utils/parameters/getParameterIcon';

interface ParameterItemProps {
    parameter: Parameter;
    selectedIds: string[];
    onSelect: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    handleDragStart: (e: React.DragEvent, id: string) => void;
}

export const ParameterItem = memo(function ParameterItem({
    parameter,
    selectedIds,
    onSelect,
    handleDragStart,
}: ParameterItemProps) {
    const isSelected = selectedIds.includes(parameter.id);
    const isPartOfSelectionGroup = isSelected && selectedIds.length > 1;
    const Icon = getParameterIcon(parameter.type);

    const handleClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            onSelect(parameter.id, e.ctrlKey || e.metaKey, e.shiftKey);
        },
        [parameter.id, onSelect],
    );

    return (
        <li
            data-id={parameter.id}
            className="relative select-none cursor-grab"
            onClick={handleClick}
            onDragStart={(e) => handleDragStart(e, parameter.id)}
            draggable={true}
        >
            <div
                className={`
                        w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center text-nowrap
                        ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10' : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'}
                        ${isPartOfSelectionGroup && 'border-bg-accent/20'}
                        ${isSelected ? 'text-text-accent' : 'text-foreground'}
                    `}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon size={16} className="min-w-4" />

                    <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                    <span className="text-sm truncate">{parameter.name}</span>
                </div>
            </div>
        </li>
    );
});
