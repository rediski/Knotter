'use client';

import { memo } from 'react';

import type { Parameter } from '@/_core/_/parameter';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { useItemsStore } from '@/store/useItemsStore';

import { getParameterIcon } from '@/utils/nodes/getParameterIcon';
import { updateNodeParameter } from '@/utils/parameters/updateNodeParameter';
import { unassignParameter } from '@/utils/parameters/unassignParameter';

import { X } from 'lucide-react';

export const NodeParameters = memo(function NodeParameters({
    nodeParameter,
    nodeId,
}: {
    nodeParameter: Parameter;
    nodeId: string;
}) {
    if (!nodeParameter || nodeParameter.type === null || nodeParameter.type === undefined) {
        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 opacity-50">
                <div className="flex items-center gap-2 w-full truncate">
                    <span className="text-gray-500">Некорректный параметр</span>
                </div>
                <button
                    onClick={() => unassignParameter(nodeParameter?.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    const ParameterIcon = getParameterIcon(nodeParameter.type);
    const { parameters } = useItemsStore();

    if (nodeParameter.type === 'number') {
        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{nodeParameter.name}</p>
                </div>

                <Input
                    value={typeof nodeParameter.value === 'number' ? nodeParameter.value.toString() : '0'}
                    type="number"
                    className="bg-depth-3 border border-depth-4 hover:bg-depth-4"
                    onChange={(newValue) => {
                        if (newValue === null) return;
                        const numValue = parseFloat(newValue);
                        if (isNaN(numValue)) return;
                        updateNodeParameter(nodeId, nodeParameter.id, numValue);
                    }}
                />
                <button
                    onClick={() => unassignParameter(nodeParameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (nodeParameter.type === 'string') {
        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{nodeParameter.name}</p>
                </div>
                <Input
                    value={typeof nodeParameter.value === 'string' ? nodeParameter.value : ''}
                    placeholder="Введите значение"
                    className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                    onChange={(newValue) => {
                        if (newValue === null) return;
                        updateNodeParameter(nodeId, nodeParameter.id, newValue);
                    }}
                />
                <button
                    onClick={() => unassignParameter(nodeParameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (nodeParameter.type === 'boolean') {
        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 truncate">
                        <ParameterIcon size={16} />
                        <span className="truncate">{nodeParameter.name}</span>
                    </div>
                    <Checkbox
                        checked={typeof nodeParameter.value === 'boolean' ? nodeParameter.value : false}
                        className="bg-depth-3 border border-depth-4"
                        onChange={(checked) => updateNodeParameter(nodeId, nodeParameter.id, checked)}
                    />
                </div>
                <button
                    onClick={() => unassignParameter(nodeParameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (nodeParameter.type === 'enum') {
        const globalParameter = parameters.find((p) => p.id === nodeParameter.id);
        const options = Array.isArray(globalParameter?.defaultValue) ? globalParameter.defaultValue : [];
        const selectedValue = typeof nodeParameter.value === 'string' ? nodeParameter.value : null;

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{nodeParameter.name}</p>
                </div>
                <div className="w-full">
                    <DropdownAbsolute title={selectedValue || (options[0] as string) || ''} depth={3} align="right">
                        {options.map((option: string) => (
                            <button
                                key={option}
                                onClick={() => updateNodeParameter(nodeId, nodeParameter.id, option)}
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
                <button
                    onClick={() => unassignParameter(nodeParameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 opacity-50">
            <div className="flex items-center gap-2 w-full truncate">
                <span className="text-gray-500">Неизвестный тип: {String(nodeParameter.type)}</span>
            </div>
            <button
                onClick={() => unassignParameter(nodeParameter.id)}
                className="cursor-pointer text-gray hover:text-white min-w-4"
            >
                <X size={16} />
            </button>
        </div>
    );
});
