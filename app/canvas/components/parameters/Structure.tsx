'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { EmptyState } from '@/components/UI/EmptyState';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { X } from 'lucide-react';

const parameterComponents = {
    number: Number,
    string: String,
    boolean: Boolean,
    enum: Enum,
} as const;

type ParameterType = keyof typeof parameterComponents;

export const Structure = memo(function Structure({ parameter, isSelected }: { parameter: Parameter; isSelected: boolean }) {
    if (!isStructure(parameter)) return null;

    const handleDelete = (e: React.MouseEvent, parameterId: string) => {
        e.stopPropagation();
        removeParameter(parameterId);
    };

    const renderChildParameter = (childParameter: Parameter) => {
        const Component = parameterComponents[childParameter.type as ParameterType];
        return (
            <div key={childParameter.id} className="relative">
                <Component parameter={childParameter} isSelected={isSelected} />

                <button
                    onClick={(e) => handleDelete(e, childParameter.id)}
                    className="absolute right-3 top-4 -translate-y-1/2 focus:outline-none text-gray cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>
        );
    };

    const supportedParameters = parameter.data.filter((p) => p.type in parameterComponents);

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 h-8">
                <div className="w-2 h-2 bg-json-null rounded-full" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-null"
                />
            </div>

            <div className="flex flex-col gap-1 py-2">
                {supportedParameters.length === 0 ? (
                    <EmptyState message="Параметры не найдены" />
                ) : (
                    supportedParameters.map(renderChildParameter)
                )}
            </div>
        </div>
    );
});
