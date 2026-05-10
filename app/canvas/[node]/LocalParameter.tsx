'use client';

import { memo } from 'react';

import type { Parameter, NodeParameter } from '@/canvas/_core/_/parameter';
import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';
import { updateNodeParameter } from '@/canvas/utils/parameters/updateNodeParameter';
import { unassignParameter } from '@/canvas/utils/parameters/unassignParameter';

import { X } from 'lucide-react';

export const LocalParameter = memo(function LocalParameter({
    nodeParameter,
    nodeId,
}: {
    nodeParameter: NodeParameter;
    nodeId: string;
}) {
    const ParameterIcon = getParameterIcon(nodeParameter.type);
    const parameters = useItemsStore((state) => state.parameters);

    if (isNumber(nodeParameter)) {
        const handleNumberChange = (newValue: string | null) => {
            if (newValue === null) return;

            const numValue = parseFloat(newValue);

            if (isNaN(numValue)) return;

            updateNodeParameter(nodeId, nodeParameter.id, numValue);
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{nodeParameter.name}</p>
                </div>

                <Input
                    value={nodeParameter.value?.toString() ?? '0'}
                    type="number"
                    className="bg-depth-3 border border-depth-4 hover:bg-depth-4"
                    onChange={handleNumberChange}
                />

                {nodeParameter.parentId === null && (
                    <button
                        onClick={() => unassignParameter(nodeParameter.id)}
                        className="cursor-pointer text-gray hover:text-white min-w-4"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        );
    }

    if (isString(nodeParameter)) {
        const handleStringChange = (newValue: string | null) => {
            if (newValue === null) return;
            updateNodeParameter(nodeId, nodeParameter.id, newValue);
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{nodeParameter.name}</p>
                </div>

                <Input
                    value={(nodeParameter.value as string) ?? ''}
                    placeholder="Введите значение"
                    className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                    onChange={handleStringChange}
                />

                {nodeParameter.parentId === null && (
                    <button
                        onClick={() => unassignParameter(nodeParameter.id)}
                        className="cursor-pointer text-gray hover:text-white min-w-4"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        );
    }

    if (isBoolean(nodeParameter)) {
        const handleBooleanChange = (checked: boolean) => {
            updateNodeParameter(nodeId, nodeParameter.id, checked);
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 truncate">
                        <ParameterIcon size={16} />
                        <span className="truncate">{nodeParameter.name}</span>
                    </div>

                    <Checkbox
                        checked={(nodeParameter.value as boolean) ?? false}
                        className={`
                            bg-depth-3 border border-depth-4
                            ${nodeParameter.value === true ? 'hover:bg-bg-accent' : 'hover:bg-depth-4'}
                        `}
                        onChange={handleBooleanChange}
                    />
                </div>

                {nodeParameter.parentId === null && (
                    <button
                        onClick={() => unassignParameter(nodeParameter.id)}
                        className="cursor-pointer text-gray hover:text-white min-w-4"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        );
    }

    if (isEnum(nodeParameter)) {
        const selectedValue = nodeParameter.value as string | null;

        const globalParameter = parameters.find((p) => p.id === nodeParameter.id);
        const options = (globalParameter?.defaultValue as string[]) || [];

        const getCurrentEnumValue = () => {
            return selectedValue || options[0] || '';
        };

        const handleEnumChange = (selected: string) => {
            updateNodeParameter(nodeId, nodeParameter.id, selected);
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{nodeParameter.name}</p>
                </div>

                <div className="w-full">
                    <DropdownAbsolute title={getCurrentEnumValue()} depth={3} align="right">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleEnumChange(option)}
                                className={`
                                w-full text-left px-3 py-1.5 rounded-md border cursor-pointer
                                ${
                                    option === selectedValue
                                        ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent'
                                        : 'bg-depth-4 hover:bg-depth-5 border-depth-5'
                                }
                            `}
                            >
                                {option}
                            </button>
                        ))}
                    </DropdownAbsolute>
                </div>

                {nodeParameter.parentId === null && (
                    <button
                        onClick={() => unassignParameter(nodeParameter.id)}
                        className="cursor-pointer text-gray hover:text-white min-w-4"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        );
    }

    if (isStructure(nodeParameter)) {
        const structureValue = nodeParameter.value as string[];

        const childParameters = structureValue
            .map((id) => parameters.find((parameter) => parameter.id === id))
            .filter((parameter): parameter is Parameter => parameter !== undefined)
            .map((nodeParameter) => ({
                id: nodeParameter.id,
                name: nodeParameter.name,
                type: nodeParameter.type,
                parentId: nodeParameter.parentId,
                value: nodeParameter.defaultValue,
            })) as NodeParameter[];

        return (
            <div className="flex flex-col gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                        <ParameterIcon size={16} className="text-icon-secondary shrink-0" />
                        <p className="truncate">{nodeParameter.name}</p>
                    </div>

                    {nodeParameter.parentId === null && (
                        <button
                            onClick={() => unassignParameter(nodeParameter.id)}
                            className="cursor-pointer text-gray hover:text-white min-w-4"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-1 border-depth-4 p-1 bg-depth-1 rounded-md border border-dashed">
                    {childParameters.length === 0 ? (
                        <p className="flex items-center justify-center p-2 text-gray">Нет вложенных параметров</p>
                    ) : (
                        childParameters.map((childParameter) => (
                            <LocalParameter key={childParameter.id} nodeParameter={childParameter} nodeId={nodeId} />
                        ))
                    )}
                </div>
            </div>
        );
    }

    return null;
});
