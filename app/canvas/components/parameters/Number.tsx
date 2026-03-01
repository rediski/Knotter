'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';
import { isNumber } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { useNumberParameter } from '@/canvas/components/parameters/useNumber';

import { getIcon } from '@/canvas/utils/nodes/getIcon';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { X } from 'lucide-react';

export const Number = memo(function Number({ parameter }: { parameter: Parameter }) {
    const { handleUpdateCurrentValue, handleUpdateMinValue, handleUpdateMaxValue } = useNumberParameter({
        parameter,
        updateParameter,
    });

    const Icon = getIcon(parameter.type);

    if (!parameter) return;
    if (!isNumber(parameter)) return;

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
                        <p className="truncate w-full text-right">Текущее значение</p>

                        <Input
                            value={parameter.data.value.toString()}
                            onChange={handleUpdateCurrentValue}
                            className="bg-depth-3 border border-depth-4"
                            type="number"
                        />
                    </div>

                    <div
                        className={`
                            flex items-center gap-2
                            ${!parameter.data.min && 'opacity-50'}
                        `}
                    >
                        <p className="truncate w-full text-right">Минимальное значение</p>

                        <Input
                            value={parameter.data.min?.toString() ?? ''}
                            onChange={handleUpdateMinValue}
                            className="bg-depth-3 border border-depth-4"
                            type="number"
                            placeholder="Не задано"
                        />
                    </div>

                    <div
                        className={`
                            flex items-center gap-2
                            ${!parameter.data.max && 'opacity-50'}
                        `}
                    >
                        <p className="truncate w-full text-right">Максимальное значение</p>

                        <Input
                            value={parameter.data.max?.toString() ?? ''}
                            onChange={handleUpdateMaxValue}
                            className="bg-depth-3 border border-depth-4"
                            type="number"
                            placeholder="Не задано"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
