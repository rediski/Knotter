'use client';

import { memo } from 'react';

import { EditableName } from '@/components/UI/EditableName';

import { Parameter, ParameterValue } from '@/canvas/utils/parameters/parameter.types';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { isArrayValue } from '@/canvas/utils/parameters/parameter.type-guards';

import { X } from 'lucide-react';

interface ArrayParamterProps {
    parameter: Parameter;
    handleAddArrayParameter: (newParameter: Parameter) => void;
    handleRemoveArrayParameter: (parameterId: string) => void;
    handleUpdateArrayParameterName: (parameterId: string, newName: string) => void;
    handleUpdateArrayParameterValue: (parameterId: string, newData: ParameterValue) => void;
    handleUpdateEnumOptionValue: (optionId: string, newValue: string) => void;
    removeParameter: (parameterId: string) => void;
}

export const ArrayParameter = memo(function ArrayParameter({
    parameter,
    handleUpdateArrayParameterName,
    removeParameter,
}: ArrayParamterProps) {
    const ArrayIcon = getDynamicIcon('array');

    if (!isArrayValue(parameter)) return null;

    return (
        <div className="flex flex-col gap-1 px-3 py-2 bg-depth-2 text-sm rounded-md">
            <div className="flex items-center gap-1 h-8">
                <ArrayIcon size={16} className="min-w-4" />

                <EditableName name={parameter.name} onChange={() => handleUpdateArrayParameterName} className="w-full" />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1 border-l pl-6 border-depth-6">В разработке...</div>
        </div>
    );
});
