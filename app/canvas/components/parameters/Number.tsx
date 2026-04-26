'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isNumber } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { useNumberParameter } from '@/canvas/components/parameters/useNumber';

import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

export const Number = memo(function Number({
    parameter,
    isSelected,
    hasParameterInNode,
}: {
    parameter: Parameter;
    isSelected: boolean;
    hasParameterInNode: boolean;
}) {
    const { updateDefaultValue } = useNumberParameter({
        parameter,
        updateParameter,
    });

    if (!isNumber(parameter)) return null;

    return (
        <div className="flex items-center gap-2 h-8 w-full">
            {!hasParameterInNode && <div className="min-w-2 h-2 bg-json-number rounded-full" />}

            <EditableName
                name={parameter.name}
                onChange={(newName) => updateParameterName(parameter.id, newName)}
                className="w-full text-json-number"
            />

            <Input
                value={String(parameter.defaultValue ?? '')}
                onChange={updateDefaultValue}
                className={`
                    border ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'} 
                `}
                type="number"
                placeholder="Введите значение"
            />
        </div>
    );
});
