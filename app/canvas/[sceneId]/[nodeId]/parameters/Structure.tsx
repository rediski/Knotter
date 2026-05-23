'use client';

import { memo, useMemo } from 'react';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { EditableName } from '@/components/UI/EditableName';
import { EmptyState } from '@/components/UI/EmptyState';
import { ParameterItem } from '@/canvas/[sceneId]/[nodeId]/ParameterItem';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

interface StructureProps {
    parameter: Parameter;
    selectedIds: Set<string>;
    onSelect: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    hasParameterInNode: boolean;
}

export const Structure = memo(function Structure({ parameter, selectedIds, onSelect, hasParameterInNode }: StructureProps) {
    const parameters = useItemsStore((state) => state.parameters);

    if (!isStructure(parameter)) return null;

    const parameterData = useMemo(() => {
        return parameter.defaultValue
            .map((id) => parameters.find((pararmeter) => pararmeter.id === id))
            .filter((pararmeter): pararmeter is Parameter => pararmeter !== undefined);
    }, [parameter.defaultValue, parameters]);

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 h-8">
                {!hasParameterInNode && <div className="w-2 h-2 bg-json-null rounded-full" />}

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-null"
                    disabled={hasParameterInNode}
                />
            </div>

            <div className="flex flex-col gap-1 bg-depth-1 p-1 rounded-md border-dashed border border-depth-3">
                {parameterData.length === 0 ? (
                    <EmptyState message="Параметры не найдены" />
                ) : (
                    parameterData.map((childParameter) => (
                        <ParameterItem
                            key={childParameter.id}
                            parameter={childParameter}
                            selectedIds={selectedIds}
                            onSelect={onSelect}
                            hasParameterInNode={hasParameterInNode}
                        />
                    ))
                )}
            </div>
        </div>
    );
});
