'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isBoolean } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { FlagTriangleRight, X } from 'lucide-react';

export const Boolean = memo(function Boolean({ parameter }: { parameter: Parameter }) {
    const handleCheckboxChange = (checked: boolean) => {
        updateParameter(parameter.id, {
            data: checked,
        });
    };

    if (!parameter) return;
    if (!isBoolean(parameter)) return;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 rounded-md">
            <div className="flex items-center gap-1 h-8">
                <FlagTriangleRight size={16} className="min-w-4" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full"
                />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1">
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                        <p className="truncate w-full text-right">Базовое значение</p>

                        <div className="w-full">
                            <Checkbox
                                checked={parameter.data}
                                onChange={(checked) => handleCheckboxChange(checked)}
                                className="bg-depth-3 border border-depth-4"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
