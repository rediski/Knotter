'use client';

import { memo } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';
import type { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';

import { useItemsStore } from '@/canvas/store/useItemsStore';

import { OptionPicker } from '@/components/UI/OptionPicker';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';

import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';
import { addParameterToSelectedNode } from '@/canvas/utils/parameters/addParameterToSelectedNode';
import { removeParameterFromSelectedNode } from '@/canvas/utils/parameters/removeParameterFromSelectedNode'; // Добавлен импорт

import { X } from 'lucide-react';

export const NodeParameters = memo(function NodeParameters({ node }: { node: Node }) {
    const items = useItemsStore((state) => state.items);
    const setItems = useItemsStore((state) => state.setItems);
    const parameters = useItemsStore((state) => state.parameters);

    const storeNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;

    const nodeParameters = storeNode?.parameters ?? [];

    const filteredParameters = parameters.filter(
        (template) => !nodeParameters.some((nodeParam) => nodeParam.id === template.id),
    );

    const options = filteredParameters.map((param) => ({
        value: param.id,
        label: param.name,
        icon: getParameterIcon(param.type),
    }));

    const updateNodeParameter = (nodeId: string, parameterId: string, updates: Partial<Parameter>) => {
        const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
        if (nodeIndex === -1) return;

        const currentNode = items[nodeIndex] as Node;

        const updatedNodeParameters = currentNode.parameters.map((param) =>
            param.id === parameterId ? { ...param, ...updates } : param,
        );

        const updatedNode: Node = {
            ...currentNode,
            parameters: updatedNodeParameters,
        };

        const updatedItems = [...items];
        updatedItems[nodeIndex] = updatedNode;

        setItems(updatedItems);
    };

    return (
        <div className="flex flex-col w-full gap-1">
            {nodeParameters.length > 0 && (
                <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-3">
                    {nodeParameters.map((parameter: Parameter) => {
                        const parameterContent = (() => {
                            if (parameter.type === 'number') {
                                const parameterData = parameter.data as ParameterTypeMap['number'];

                                return (
                                    <div className="flex items-center gap-1 w-full">
                                        <p className="w-full text-sm truncate">{parameter.name}</p>
                                        <Input
                                            min={parameterData.min}
                                            max={parameterData.max}
                                            value={parameterData.value.toString()}
                                            type="number"
                                            className="bg-depth-2 border border-depth-3 hover:bg-depth-3 active:bg-depth-4"
                                            onChange={(newValue) => {
                                                const numValue = parseFloat(newValue);
                                                if (!isNaN(numValue)) {
                                                    let clampedValue = numValue;

                                                    if (parameterData.min !== undefined) {
                                                        clampedValue = Math.max(clampedValue, parameterData.min);
                                                    }

                                                    if (parameterData.max !== undefined) {
                                                        clampedValue = Math.min(clampedValue, parameterData.max);
                                                    }

                                                    updateNodeParameter(node.id, parameter.id, {
                                                        data: {
                                                            ...parameterData,
                                                            value: clampedValue,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                );
                            }

                            if (parameter.type === 'string') {
                                return (
                                    <div className="flex items-center gap-1 w-full">
                                        <p className="w-full text-sm truncate">{parameter.name}</p>
                                        <Input
                                            value={parameter.data as string}
                                            onChange={(newValue) => {
                                                updateNodeParameter(node.id, parameter.id, {
                                                    data: newValue,
                                                });
                                            }}
                                            placeholder={parameter.name}
                                            className="bg-depth-2 hover:bg-depth-3 border border-depth-3"
                                        />
                                    </div>
                                );
                            }

                            if (parameter.type === 'boolean') {
                                return (
                                    <label className="flex items-center justify-between w-full gap-1 select-none cursor-pointer truncate">
                                        {parameter.name}
                                        <Checkbox
                                            checked={parameter.data as boolean}
                                            onChange={(checked) => {
                                                updateNodeParameter(node.id, parameter.id, {
                                                    data: checked,
                                                });
                                            }}
                                            className={`bg-depth-2 ${
                                                parameter.data === true
                                                    ? 'hover:bg-bg-accent'
                                                    : 'hover:bg-depth-3 active:bg-depth-4'
                                            }`}
                                        />
                                    </label>
                                );
                            }

                            if (parameter.type === 'enum') {
                                const parameterData = parameter.data as ParameterTypeMap['enum'];

                                return (
                                    <div className="flex items-center gap-1 w-full">
                                        <p className="w-full text-sm truncate">{parameter.name}</p>
                                        <Select
                                            value={parameterData.value}
                                            options={parameterData.options}
                                            onChange={(newValue) => {
                                                updateNodeParameter(node.id, parameter.id, {
                                                    data: {
                                                        ...parameterData,
                                                        value: newValue,
                                                    },
                                                });
                                            }}
                                            label={parameter.name}
                                        />
                                    </div>
                                );
                            }

                            return null;
                        })();

                        return (
                            <div key={parameter.id} className="flex items-center gap-2">
                                {parameterContent}
                                <button
                                    onClick={() => removeParameterFromSelectedNode(parameter.id)}
                                    className="cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <OptionPicker
                options={options}
                onSelect={(parameterId) => addParameterToSelectedNode(parameterId)}
                placeholder="Добавить параметр"
            />
        </div>
    );
});
