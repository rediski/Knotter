'use client';

import { memo } from 'react';

import type { Parameter } from '@/_core/_/parameter';
import { isString } from '@/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Input } from '@/components/UI/Input';

import { useStringParameter } from '@/components/parameters/useString';

import { updateParameter } from '@/utils/parameters/updateParameter';
import { updateParameterName } from '@/utils/parameters/updateParameterName';

export const String = memo(function String({
    parameter,
    isSelected,
    hasParameterInNode,
}: {
    parameter: Parameter;
    isSelected: boolean;
    hasParameterInNode: boolean;
}) {
    const { updateDefaultValue } = useStringParameter({
        parameter,
        updateParameter,
    });

    if (!parameter) return null;
    if (!isString(parameter)) return null;

    return (
        <div className="flex items-center gap-2 h-8 w-full">
            {!hasParameterInNode && <div className="min-w-2 h-2 bg-json-string rounded-full" />}

            <EditableName
                name={parameter.name}
                onChange={(newName) => updateParameterName(parameter.id, newName)}
                className="w-full text-json-string"
                disabled={hasParameterInNode}
            />

            <Input
                value={parameter.defaultValue}
                onChange={updateDefaultValue}
                placeholder="Введите значение"
                disabled={hasParameterInNode}
                className={`
                    border 
                    ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                    ${hasParameterInNode && 'cursor-not-allowed opacity-50'}
                `}
            />
        </div>
    );
});
