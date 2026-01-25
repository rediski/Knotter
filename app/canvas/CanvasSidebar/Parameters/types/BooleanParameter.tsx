'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter.types';
import { isBooleanValue } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { useParameters } from '@/canvas/CanvasSidebar/Parameters/core/useParameters';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { X } from 'lucide-react';

interface BooleanParameterProps {
    parameter: Parameter;
    handleUpdateParameterName: (newName: string) => void;
    removeParameter: (parameterId: string) => void;
}

export const BooleanParameter = memo(function BooleanParameter({
    parameter,
    handleUpdateParameterName,
    removeParameter,
}: BooleanParameterProps) {
    const { updateParameter } = useParameters();

    const handleCheckboxChange = (checked: boolean) => {
        updateParameter(parameter.id, {
            value: checked,
        });
    };

    const Icon = getDynamicIcon(parameter.type);

    if (!parameter) return;
    if (!isBooleanValue(parameter)) return;

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

                        <div className="w-full">
                            <Checkbox
                                checked={parameter.value}
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
