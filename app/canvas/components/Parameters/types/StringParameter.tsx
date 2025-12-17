'use client';

import { memo } from 'react';

import type { Parameter } from '@/canvas/utils/parameters/parameter.types';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { isStringValue } from '@/canvas/utils/parameters/parameter.type-guards';

import { X } from 'lucide-react';

interface StringParameterProps {
    parameter: Parameter;
    handleInputChange: (value: string) => void;
    handleUpdateParameterName: (newName: string) => void;
    removeParameter: (parameterId: string) => void;
}

export const StringParameter = memo(function StringParameter({
    parameter,
    handleInputChange,
    handleUpdateParameterName,
    removeParameter,
}: StringParameterProps) {
    const Icon = getDynamicIcon(parameter.type);

    if (!parameter) return;
    if (!isStringValue(parameter)) return;

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
                            value={parameter.value}
                            onChange={(val) => handleInputChange(val)}
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
