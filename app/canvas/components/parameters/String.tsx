'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isString } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { getIcon } from '@/canvas/utils/nodes/getIcon';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { X } from 'lucide-react';

export const String = memo(function String({ parameter }: { parameter: Parameter }) {
    const Icon = getIcon(parameter.type);

    if (!parameter) return;
    if (!isString(parameter)) return;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 rounded-md">
            <div className="flex items-center gap-1 h-8">
                <Icon size={16} className="min-w-4" />

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

                        <Input
                            value={parameter.data}
                            onChange={(value) =>
                                updateParameter(parameter.id, {
                                    data: value,
                                })
                            }
                            className="bg-depth-3 border border-depth-4"
                            max={16}
                            placeholder="Введите текст..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
