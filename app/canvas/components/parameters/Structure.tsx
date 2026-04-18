'use client';

import { memo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { EditableName } from '@/components/UI/EditableName';
import { EmptyState } from '@/components/UI/EmptyState';
import { ParameterItem } from '@/canvas/_core/Node/ParameterItem';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

interface StructureProps {
    parameter: Parameter;
    isSelected: boolean;
    selectedIds: Set<string>;
    onSelect: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
}

export const Structure = memo(function Structure({ parameter, isSelected, selectedIds, onSelect }: StructureProps) {
    if (!isStructure(parameter)) return null;

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

            <div className="flex flex-col gap-1 py-2 ml-4">
                {parameter.data.length === 0 ? (
                    <EmptyState message="Параметры не найдены" />
                ) : (
                    parameter.data.map((childParameter) => (
                        <ParameterItem
                            key={childParameter.id}
                            parameter={childParameter}
                            selectedIds={selectedIds}
                            onSelect={onSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
});
