'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/components/Parameters/core/parameter.types';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { isStructureValue } from '@/canvas/components/Parameters/core/parameter.type-guards';

import { X } from 'lucide-react';

interface StructureParamterProps {
    parameter: Parameter;
    removeParameter: (parameterId: string) => void;
}

export const StructureParameter = memo(function StructureParameter({ parameter, removeParameter }: StructureParamterProps) {
    const StructureIcon = getDynamicIcon('structure');

    if (!isStructureValue(parameter)) return null;

    return (
        <div className="flex flex-col gap-1 px-3 py-2 bg-depth-2 text-sm rounded-md">
            <div className="flex items-center gap-1 h-8">
                <StructureIcon size={16} className="min-w-4" />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1 border-l pl-6 border-depth-6">В разработке...</div>
        </div>
    );
});
