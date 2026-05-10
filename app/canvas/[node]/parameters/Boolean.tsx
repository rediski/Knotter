'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isBoolean } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { useBooleanParameter } from '@/canvas/[node]/parameters/useBoolean';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';

export const Boolean = memo(function Boolean({
    parameter,
    isSelected,
    hasParameterInNode,
}: {
    parameter: Parameter;
    isSelected: boolean;
    hasParameterInNode: boolean;
}) {
    if (!parameter) return null;
    if (!isBoolean(parameter)) return null;

    const { updateDefaultValue } = useBooleanParameter({
        parameter,
        updateParameter,
    });

    return (
        <div className="flex items-center gap-2 h-8 w-full">
            {!hasParameterInNode && <div className="min-w-2 h-2 bg-json-boolean rounded-full" />}

            <EditableName
                name={parameter.name}
                onChange={(newName) => updateParameterName(parameter.id, newName)}
                className="w-full text-json-boolean"
                disabled={hasParameterInNode}
            />

            <div className={`w-full ${hasParameterInNode && 'opacity-50'}`}>
                <Checkbox
                    checked={parameter.defaultValue}
                    onChange={updateDefaultValue}
                    disabled={hasParameterInNode}
                    className={`
                        border
                        ${hasParameterInNode && 'cursor-not-allowed'}
                        ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                    `}
                />
            </div>
        </div>
    );
});
