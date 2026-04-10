'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isString } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Input } from '@/components/UI/Input';

import { useStringParameter } from '@/canvas/components/parameters/useStringParameter';

import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { X } from 'lucide-react';

export const String = memo(function String({ parameter }: { parameter: Parameter }) {
    const { handleUpdateValue } = useStringParameter({
        parameter,
        updateParameter,
    });

    if (!parameter) return;
    if (!isString(parameter)) return;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 border border-depth-3 rounded-md">
            <div className="flex items-center gap-2 h-8">
                <div className="min-w-2 h-2 bg-json-string rounded-full" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-string"
                />

                <Input
                    value={parameter.data}
                    onChange={handleUpdateValue}
                    className="bg-depth-3 border border-depth-4"
                    type="number"
                    placeholder="Введите значение"
                />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
});
