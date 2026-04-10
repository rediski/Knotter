'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isBoolean } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';

import { X } from 'lucide-react';

export const Boolean = memo(function Boolean({ parameter }: { parameter: Parameter }) {
    if (!parameter || !isBoolean(parameter)) {
        return null;
    }

    const handleUpdateValue = (checked: boolean) => {
        updateParameter(parameter.id, {
            ...parameter,
            data: checked,
        });
    };

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 border border-depth-3 rounded-md">
            <div className="flex items-center gap-2 h-8">
                <div className="w-2 h-2 bg-json-boolean rounded-full" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-boolean"
                />

                <Checkbox checked={parameter.data} onChange={handleUpdateValue} />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
});
