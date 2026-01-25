'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter.types';
import { isNumberValue } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { useParameters } from '@/canvas/CanvasSidebar/Parameters/core/useParameters';
import { useNumberParameter } from '@/canvas/CanvasSidebar/Parameters/types/useNumberParameter';

import { X } from 'lucide-react';

interface NumberParameterProps {
    parameter: Parameter;
    handleUpdateParameterName: (newName: string) => void;
    removeParameter: (parameterId: string) => void;
}

export const NumberParameter = memo(function NumberParameter({
    parameter,
    handleUpdateParameterName,
    removeParameter,
}: NumberParameterProps) {
    const { updateParameter } = useParameters();

    const { handleUpdateCurrentValue, handleUpdateMinValue, handleUpdateMaxValue, handleUpdateStepValue } =
        useNumberParameter({ parameter, updateParameter });

    const Icon = getDynamicIcon(parameter.type);

    if (!parameter) return;
    if (!isNumberValue(parameter)) return;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 rounded-md">
            <div className="flex items-center gap-1 h-8">
                <Icon size={16} className="min-w-4" />

                <EditableName name={parameter.name} onChange={handleUpdateParameterName} className="w-full" />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1">
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                        <p className="truncate w-full text-right">Базовое значение</p>

                        <Input
                            value={parameter.value.currentValue.toString()}
                            onChange={handleUpdateCurrentValue}
                            className="bg-depth-3 border border-depth-4"
                            type="number"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="truncate w-full text-right">Минимальное значение</p>

                        <Input
                            value={parameter.value.min.toString()}
                            onChange={handleUpdateMinValue}
                            className="bg-depth-3 border border-depth-4"
                            type="number"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="truncate w-full text-right">Максимальное значение</p>

                        <Input
                            value={parameter.value.max.toString()}
                            onChange={handleUpdateMaxValue}
                            className="bg-depth-3 border border-depth-4"
                            type="number"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="truncate w-full text-right">Шаг изменения</p>

                        <Input
                            value={parameter.value.step.toString()}
                            onChange={handleUpdateStepValue}
                            className="bg-depth-3 border border-depth-4"
                            placeholder="1"
                            type="number"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
