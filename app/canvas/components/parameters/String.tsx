'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isString } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Input } from '@/components/UI/Input';

import { useStringParameter } from '@/canvas/components/parameters/useString';

import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

export const String = memo(function String({ parameter, isSelected }: { parameter: Parameter; isSelected: boolean }) {
    const { handleUpdateValue } = useStringParameter({
        parameter,
        updateParameter,
    });

    if (!parameter) return;
    if (!isString(parameter)) return;

    return (
        <div className="flex items-center gap-2 h-8 w-full">
            <div className="min-w-2 h-2 bg-json-string rounded-full" />

            <EditableName
                name={parameter.name}
                onChange={(newName) => updateParameterName(parameter.id, newName)}
                className="w-full text-json-string"
            />

            <Input
                value={parameter.value}
                onChange={handleUpdateValue}
                className={`border ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}`}
                placeholder="Введите значение"
            />
        </div>
    );
});
