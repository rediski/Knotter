'use client';

import { memo, type Ref } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';
import { Structure } from '@/canvas/components/parameters/Structure';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

const parameterComponents = {
    number: Number,
    string: String,
    boolean: Boolean,
    enum: Enum,
    structure: Structure,
} as const;

type ParameterType = keyof typeof parameterComponents;

export const ParameterItem = memo(function ParameterItem({ parameter }: { parameter: Parameter }) {
    const reorderParameter = (draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => {
        const parameters = useItemsStore.getState().parameters;

        const fromIndex = parameters.findIndex((p) => p.id === draggedId);
        const toIndex = parameters.findIndex((p) => p.id === targetId);

        if (fromIndex === -1 || toIndex === -1) return;

        const updatedParameters = [...parameters];
        const [movedParameter] = updatedParameters.splice(fromIndex, 1);

        let insertIndex = position === 'top' ? toIndex : toIndex + 1;

        if (fromIndex < toIndex && position === 'bottom') {
            insertIndex = toIndex;
        }

        updatedParameters.splice(insertIndex, 0, movedParameter);
        useItemsStore.getState().setParameters(updatedParameters);
    };

    const { dragRef, dropRef, isDragOver, dragPosition } = useDragAndDrop({
        itemId: parameter.id,
        onDrop: reorderParameter,
    });

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', parameter.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const Component = parameterComponents[parameter.type as ParameterType];

    if (!Component) {
        console.error(`Неизвестный тип параметра: ${parameter.type}`);
        return null;
    }

    return (
        <div ref={dropRef as Ref<HTMLDivElement>} className="relative cursor-grab">
            {isDragOver && dragPosition === 'top' && <div className="absolute top-0 left-0 right-0 h-0.5 bg-bg-accent" />}
            {isDragOver && dragPosition === 'bottom' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-accent" />
            )}

            <div ref={dragRef as Ref<HTMLDivElement>} draggable onDragStart={handleDragStart}>
                <Component parameter={parameter} />
            </div>
        </div>
    );
});
