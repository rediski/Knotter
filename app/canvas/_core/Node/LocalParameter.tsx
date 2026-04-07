'use client';

import { memo, useCallback, type Ref } from 'react';

import type { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';

import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';
import { updateNodeParameter } from '@/canvas/utils/parameters/updateNodeParameter';
import { removeParameterFromSelectedNode } from '@/canvas/utils/parameters/removeParameterFromSelectedNode';
import { reorderParameters } from '@/canvas/utils/parameters/reorderParameters';

import { X } from 'lucide-react';

export const LocalParameter = memo(function LocalParameter({ parameter, nodeId }: { parameter: Parameter; nodeId: string }) {
    const ParameterIcon = getParameterIcon(parameter.type);

    const { dragRef, dropRef, isDragOver, dragPosition } = useDragAndDrop({
        itemId: parameter.id,
        onDrop: useCallback((draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => {
            reorderParameters({ draggedId, targetId, position });
        }, []),
    });

    const handleDragStart = useCallback(
        (e: React.DragEvent) => {
            e.dataTransfer.setData('text/plain', parameter.id);
            e.dataTransfer.effectAllowed = 'move';
        },
        [parameter.id],
    );

    const handleRemove = useCallback(() => {
        removeParameterFromSelectedNode(parameter.id);
    }, [parameter.id]);

    const handleNumberChange = useCallback(
        (newValue: string | null) => {
            if (newValue === null) return;
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
        },
        [parameter, nodeId],
    );

    const handleStringChange = useCallback(
        (newValue: string | null) => {
            if (newValue === null) return;
            updateNodeParameter(nodeId, parameter.id, { data: newValue });
        },
        [parameter, nodeId],
    );

    const handleBooleanChange = useCallback(
        (checked: boolean) => {
            updateNodeParameter(nodeId, parameter.id, { data: checked });
        },
        [parameter, nodeId],
    );

    const handleEnumChange = useCallback(
        (newValue: string | null) => {
            if (newValue === null) return;
            const paramData = parameter.data as ParameterTypeMap['enum'];
            updateNodeParameter(nodeId, parameter.id, {
                data: { ...paramData, value: newValue },
            });
        },
        [parameter, nodeId],
    );

    return (
        <div ref={dropRef as Ref<HTMLDivElement>} className="relative">
            <div
                ref={dragRef as Ref<HTMLDivElement>}
                className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 cursor-grab"
                draggable
                onDragStart={handleDragStart}
            >
                {isNumber(parameter) && (
                    <>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>
                        <Input
                            min={parameter.data.min}
                            max={parameter.data.max}
                            value={parameter.data.value.toString()}
                            type="number"
                            className="bg-depth-3 border border-depth-4 hover:bg-depth-4"
                            onChange={handleNumberChange}
                        />
                    </>
                )}

                {isString(parameter) && (
                    <>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>
                        <Input
                            value={parameter.data}
                            placeholder="Введите значение"
                            className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                            onChange={handleStringChange}
                        />
                    </>
                )}

                {isBoolean(parameter) && (
                    <label className="flex items-center justify-between w-full gap-1 select-none cursor-pointer">
                        <div className="flex items-center gap-2 truncate">
                            <ParameterIcon size={16} />
                            <span className="truncate">{parameter.name}</span>
                        </div>
                        <Checkbox
                            checked={parameter.data}
                            className={`
                                bg-depth-3 border border-depth-4
                                ${parameter.data === true ? 'hover:bg-bg-accent' : 'hover:bg-depth-4'}
                            `}
                            onChange={handleBooleanChange}
                        />
                    </label>
                )}

                {isEnum(parameter) && (
                    <>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>
                        <Select
                            value={parameter.data.value}
                            options={parameter.data.options}
                            depth={3}
                            onChange={handleEnumChange}
                        />
                    </>
                )}

                {isStructure(parameter) && (
                    <>
                        <div className="flex items-center gap-2 truncate w-full">
                            <ParameterIcon size={16} className="text-icon-secondary shrink-0" />
                            <p className="truncate w-full">{parameter.name}</p>
                        </div>
                        <p className="flex items-center w-full h-8">В разработке...</p>
                    </>
                )}

                <button
                    onClick={handleRemove}
                    className="cursor-pointer text-gray-400 hover:text-white transition-colors min-w-4"
                    aria-label={`Удалить параметр ${parameter.name}`}
                >
                    <X size={16} />
                </button>
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
