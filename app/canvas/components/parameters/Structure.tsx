'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { CreateParameterForm } from '@/canvas/_core/Node/CreateParameterForm';

import { EditableName } from '@/components/UI/EditableName';
import { EmptyState } from '@/components/UI/EmptyState';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

const parameterComponents = {
    number: Number,
    string: String,
    boolean: Boolean,
    enum: Enum,
} as const;

type ParameterType = keyof typeof parameterComponents;

export const Structure = memo(function Structure({ parameter, isSelected }: { parameter: Parameter; isSelected: boolean }) {
    if (!isStructure(parameter)) return null;

    const renderChildParameter = (childParameter: Parameter) => {
        const Component = parameterComponents[childParameter.type as ParameterType];
        return <Component key={childParameter.id} parameter={childParameter} isSelected={isSelected} />;
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

            <div className="flex flex-col gap-1">
                <CreateParameterForm depth={3} parentStructureId={parameter.id} />

                <div className="flex flex-col gap-1 py-2">
                    {supportedParameters.length === 0 ? (
                        <EmptyState message="Параметры не найдены" />
                    ) : (
                        supportedParameters.map(renderChildParameter)
                    )}
                </div>
            </div>
        </div>
    );
});
