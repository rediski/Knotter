'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isBoolean } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { useBooleanParameter } from './useBoolean';

export const Boolean = memo(function Boolean({ parameter, isSelected }: { parameter: Parameter; isSelected: boolean }) {
    if (!parameter) return null;
    if (!isBoolean(parameter)) return null;

    const { updateDefaultValue } = useBooleanParameter({
        parameter,
        updateParameter,
    });

    return (
        <div className="flex items-center gap-2 h-8 w-full">
            <div className="min-w-2 h-2 bg-json-boolean rounded-full" />

            <EditableName
                name={parameter.name}
                onChange={(newName) => updateParameterName(parameter.id, newName)}
                className="w-full text-json-boolean"
            />

            <div className="w-full">
                <Checkbox
                    checked={parameter.defaultValue}
                    onChange={updateDefaultValue}
                    className={`
                        border 
                        ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                    `}
                />
            </div>
        </div>
    );
});
