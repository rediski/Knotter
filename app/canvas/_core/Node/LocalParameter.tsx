'use client';

import { memo, type Ref } from 'react';

import type { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';

import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';
import { updateNodeParameter } from '@/canvas/utils/parameters/updateNodeParameter';
import { removeParameterFromSelectedNode } from '@/canvas/utils/parameters/removeParameterFromSelectedNode';

import { X } from 'lucide-react';

export const LocalParameter = memo(function LocalParameter({
    parameter,
    nodeId,
    onReorder,
}: {
    parameter: Parameter;
    nodeId: string;
    nodeParametersIds: string[];
    onReorder: (draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => void;
}) {
    const ParameterIcon = getParameterIcon(parameter.type);

    const { dragRef, dropRef, isDragOver, dragPosition } = useDragAndDrop({
        itemId: parameter.id,
        onDrop: (draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => {
            onReorder(draggedId, targetId, position);
        },
    });

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', parameter.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div ref={dropRef as Ref<HTMLDivElement>} className="relative">
            <div
                ref={dragRef as Ref<HTMLDivElement>}
                className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 cursor-grab"
                draggable
                onDragStart={handleDragStart}
            >
                {parameter.type === 'number' && (
                    <>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>

                        <Input
                            min={(parameter.data as ParameterTypeMap['number']).min}
                            max={(parameter.data as ParameterTypeMap['number']).max}
                            value={(parameter.data as ParameterTypeMap['number']).value.toString()}
                            type="number"
                            className="bg-depth-3 border border-depth-4 hover:bg-depth-4"
                            onChange={(newValue) => {
                                const numValue = parseFloat(newValue);

                                if (isNaN(numValue)) return;

                                const paramData = parameter.data as ParameterTypeMap['number'];
                                let clampedValue = numValue;

                                if (paramData.min !== undefined) {
                                    clampedValue = Math.max(clampedValue, paramData.min);
                                }

                                if (paramData.max !== undefined) {
                                    clampedValue = Math.min(clampedValue, paramData.max);
                                }

                                updateNodeParameter(nodeId, parameter.id, {
                                    data: { ...paramData, value: clampedValue },
                                });
                            }}
                        />
                    </>
                )}

                {parameter.type === 'string' && (
                    <>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>

                        <Input
                            value={parameter.data as string}
                            placeholder="Введите значение"
                            className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                            onChange={(newValue) => {
                                updateNodeParameter(nodeId, parameter.id, { data: newValue });
                            }}
                        />
                    </>
                )}

                {parameter.type === 'boolean' && (
                    <label className="flex items-center justify-between w-full gap-1 select-none cursor-pointer">
                        <div className="flex items-center gap-2 truncate">
                            <ParameterIcon size={16} />
                            <span className="truncate">{parameter.name}</span>
                        </div>

                        <Checkbox
                            checked={parameter.data as boolean}
                            className={`
                                bg-depth-3 border border-depth-4
                                ${parameter.data === true ? 'hover:bg-bg-accent' : 'hover:bg-depth-4'}
                            `}
                            onChange={(checked) => {
                                updateNodeParameter(nodeId, parameter.id, { data: checked });
                            }}
                        />
                    </label>
                )}

                {parameter.type === 'enum' && (
                    <>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>

                        <Select
                            value={(parameter.data as ParameterTypeMap['enum']).value}
                            options={(parameter.data as ParameterTypeMap['enum']).options}
                            depth={3}
                            onChange={(newValue) => {
                                const paramData = parameter.data as ParameterTypeMap['enum'];
                                updateNodeParameter(nodeId, parameter.id, {
                                    data: { ...paramData, value: newValue },
                                });
                            }}
                        />
                    </>
                )}

                {parameter.type === 'structure' && (
                    <>
                        <div className="flex items-center gap-2 truncate w-full">
                            <ParameterIcon size={16} className="text-icon-secondary shrink-0" />
                            <p className="truncate w-full">{parameter.name}</p>
                        </div>

                        <p className="flex items-center w-full h-8">В разработке...</p>
                    </>
                )}

                <X
                    size={16}
                    onClick={() => removeParameterFromSelectedNode(parameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                />
            </div>

            {isDragOver && dragPosition === 'top' && (
                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-bg-accent z-10" />
            )}

            {isDragOver && dragPosition === 'bottom' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-bg-accent z-10" />
            )}
        </div>
    );
});
