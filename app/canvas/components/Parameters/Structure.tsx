'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { getIcon } from '@/canvas/utils/nodes/getIcon';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { X } from 'lucide-react';

export const StructureParameter = memo(function StructureParameter({ parameter }: { parameter: Parameter }) {
    const StructureIcon = getIcon('structure');

    if (!isStructure(parameter)) return null;

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
