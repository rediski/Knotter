'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isNumber } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { useNumberParameter } from '@/canvas/components/parameters/useNumber';

import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { X } from 'lucide-react';

export const Number = memo(function Number({ parameter }: { parameter: Parameter }) {
    const { handleUpdateValue } = useNumberParameter({
        parameter,
        updateParameter,
    });

    if (!isNumber(parameter)) return null;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 border border-depth-3 rounded-md">
            <div className="flex items-center gap-2 h-8">
                <div className="min-w-2 h-2 bg-json-number rounded-full" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-number"
                />

                <Input
                    value={String(parameter.data ?? '')}
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
