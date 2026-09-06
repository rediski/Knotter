'use client';

import { memo } from 'react';

import type { Parameter } from '@/_core/_/parameter';
import { getParameterIcon } from '@/utils/parameters/getParameterIcon';
import { useItemsStore } from '@/store/useItemsStore';
import { selectParameters } from '@/utils/parameters/selectParameters';

interface ParameterItemProps {
    parameter: Parameter;
    handleDragStart: (e: React.DragEvent, id: string) => void;
}

export const ParameterItem = memo(function ParameterItem({ parameter, handleDragStart }: ParameterItemProps) {
    const selectedParameterIds = useItemsStore((state) => state.selectedParameterIds);
    const parameters = useItemsStore((state) => state.parameters);
    const isSelected = selectedParameterIds.includes(parameter.id);
    const isPartOfSelectionGroup = isSelected && selectedParameterIds.length > 1;
    const Icon = getParameterIcon(parameter.type);

    return (
        <li
            data-id={parameter.id}
            className="relative select-none cursor-grab"
            onClick={(e) => selectParameters(parameter.id, e, parameters)}
            onDragStart={(e) => handleDragStart(e, parameter.id)}
            draggable={true}
        >
            <div
                className={`
                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center text-nowrap
                    ${isSelected ? 'bg-bg-accent border border-border-accent' : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'}
                    ${isPartOfSelectionGroup && 'border-border-accent'}
                    ${isSelected ? 'text-text-accent' : 'text-foreground'}
                `}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon size={16} className="min-w-4" />

                    <div className={`border-l h-5 ${isSelected ? 'border-border-accent' : 'border-depth-4'}`} />

                    <span className="text-sm truncate">{parameter.name}</span>
                </div>
            </div>
        </li>
    );
});
