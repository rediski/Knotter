'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { CreateParameterForm } from '@/canvas/components/sidebar/CreateParameterForm';
import { EditableName } from '@/components/UI/EditableName';
import { EmptyState } from '@/components/UI/EmptyState';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { Folder, X } from 'lucide-react';

export const Structure = memo(function Structure({ parameter }: { parameter: Parameter }) {
    if (!isStructure(parameter)) return null;

    return (
        <div className="flex flex-col gap-1 px-3 py-1 bg-depth-2 text-sm rounded-md">
            <div className="flex items-center gap-2 h-8">
                <Folder size={16} className="min-w-4" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full"
                />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1 border-l pl-4 border-depth-6">
                <CreateParameterForm depth={3} />

                <div>{parameter.data.length === 0 && <EmptyState message="Параметры не найдены" />}</div>
            </div>
        </div>
    );
});
