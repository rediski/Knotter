'use client';

import { memo, useCallback, type MouseEvent } from 'react';

import type { Parameter } from '@/_core/_/parameter';

import { Number } from '@/components/parameters/Number';
import { String } from '@/components/parameters/String';
import { Boolean } from '@/components/parameters/Boolean';
import { Enum } from '@/components/parameters/Enum';
import { Structure } from '@/components/parameters/Structure';

const parameterComponents = {
    number: Number,
    string: String,
    boolean: Boolean,
    enum: Enum,
    structure: Structure,
} as const;

type ParameterType = keyof typeof parameterComponents;

interface ParameterItemProps {
    parameter: Parameter;
    selectedIds: Set<string>;
    onSelect: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    hasParameterInNode: boolean;
}

export const ParameterItem = memo(function ParameterItem({
    parameter,
    selectedIds,
    onSelect,
    hasParameterInNode,
}: ParameterItemProps) {
    const Component = parameterComponents[parameter.type as ParameterType];

    if (!Component) {
        console.error(`Неизвестный тип параметра: ${parameter.type}`);
        return null;
    }

    const isSelected = selectedIds.has(parameter.id);

    const handleClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            onSelect(parameter.id, e.ctrlKey || e.metaKey, e.shiftKey);
        },
        [parameter.id, onSelect],
    );

    return (
        <div
            onClick={handleClick}
            className={`
                flex gap-2 px-3 py-1 text-sm border rounded-md items-center group cursor-grab select-none
                ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-2 border-depth-3'}
            `}
        >
            <Component
                parameter={parameter}
                isSelected={isSelected}
                selectedIds={selectedIds}
                onSelect={onSelect}
                hasParameterInNode={hasParameterInNode}
            />
        </div>
    );
});
