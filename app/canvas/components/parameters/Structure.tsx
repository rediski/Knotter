'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { Folder, X } from 'lucide-react';

import { AddParameterForm } from '@/canvas/components/sidebar/AddParameterForm';

export const Structure = memo(function Structure({ parameter }: { parameter: Parameter }) {
    if (!isStructure(parameter)) return null;

    return (
        <div className="flex flex-col gap-1 px-3 py-2 bg-depth-2 text-sm rounded-md">
            <div className="flex items-center gap-1 h-8">
                <Folder size={16} className="min-w-4" />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1 border-l pl-4 border-depth-6">
                <AddParameterForm depth={3} />
            </div>
        </div>
    );
});
