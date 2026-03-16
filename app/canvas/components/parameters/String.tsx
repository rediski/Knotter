'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isString } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { Type, X } from 'lucide-react';

export const String = memo(function String({ parameter }: { parameter: Parameter }) {
    if (!parameter) return;
    if (!isString(parameter)) return;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 border border-depth-3 rounded-md">
            <div className="flex items-center gap-2 h-8">
                <Type size={16} className="min-w-4" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full"
                />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
});
