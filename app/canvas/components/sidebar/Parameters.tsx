'use client';

import { memo, useMemo, Fragment, useCallback } from 'react';
import type { Parameter } from '@/canvas/_core/_/parameter';

import { EmptyState } from '@/components/UI/EmptyState';
import { CreateParameterForm } from '@/canvas/components/sidebar/CreateParameterForm';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';
import { Structure } from '@/canvas/components/parameters/Structure';

import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';

const parameterComponents = {
    number: Number,
    string: String,
    boolean: Boolean,
    enum: Enum,
    structure: Structure,
} as const;

type ParameterType = keyof typeof parameterComponents;

const ParameterItem = memo(function ParameterItem({ parameter }: { parameter: Parameter }) {
    const handleParameterDrop = useCallback((draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => {
        const prev = useItemsStore.getState().parameters;
        const fromIndex = prev.findIndex((p) => p.id === draggedId);
        const toIndex = prev.findIndex((p) => p.id === targetId);

        if (fromIndex === -1 || toIndex === -1) return;

        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);

        const insertIndex = position === 'top' ? toIndex : toIndex + 1;
        next.splice(insertIndex, 0, moved);

        useItemsStore.getState().setParameters(next);
    }, []);

    const { dragRef, dropRef, isDragOver, dragPosition } = useDragAndDrop({
        itemId: parameter.id,
        onDrop: handleParameterDrop,
    });

    const Component = parameterComponents[parameter.type as ParameterType];

    if (!Component) {
        console.error(`Неизвестный тип параметра: ${parameter.type}`);
        return null;
    }

    return (
        <div ref={dropRef as React.Ref<HTMLDivElement>} className="relative cursor-grab">
            {isDragOver && (
                <div
                    className={`
                        absolute left-0 right-0 h-0.5 bg-bg-accent
                        ${dragPosition === 'top' ? 'top-0' : 'bottom-0'}
                    `}
                />
            )}

            <div ref={dragRef as React.Ref<HTMLDivElement>} draggable>
                <Component parameter={parameter} />
            </div>
        </div>
    );
});

export const Parameters = memo(function Parameters({ panelId }: { panelId?: string }) {
    const parameters = useItemsStore((state) => state.parameters);
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const hasNoFilteredResults = parameters.length > 0 && filteredParameters.length === 0;
    const hasNoParameters = parameters.length === 0;

    return (
        <div className="flex flex-col gap-1 h-full overflow-y-auto p-1 pt-0 mt-1">
            <CreateParameterForm />

            {filteredParameters.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {filteredParameters.map((parameter) => (
                        <ParameterItem key={parameter.id} parameter={parameter} />
                    ))}
                </div>
            ) : (
                <Fragment>
                    {hasNoFilteredResults ? (
                        <EmptyState message="Параметры с таким именем не найдены" />
                    ) : (
                        hasNoParameters && <EmptyState message="Параметры не найдены" />
                    )}
                </Fragment>
            )}
        </div>
    );
});
