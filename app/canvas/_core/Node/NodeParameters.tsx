'use client';

import { memo } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';
import type { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useParameters } from '@/canvas/components/SidebarPanels/Parameters/useParameters';

import { OptionPicker } from '@/components/UI/OptionPicker';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';

import { getIcon } from '@/canvas/utils/nodes/getIcon';

export const NodeParameters = memo(function NodeParameters({ node }: { node: Node }) {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);

    const { parameters, addParameterToNode } = useParameters();

    const storeNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;

    const nodeParameters = storeNode?.parameters ?? [];

    const filteredParameters = parameters.filter(
        (template) => !nodeParameters.some((nodeParam) => nodeParam.id === template.id),
    );

    const options = filteredParameters.map((param) => ({
        value: param.id,
        label: param.name,
        icon: getIcon(param.type),
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
                        if (parameter.type === 'number') {
                            const numberParameter = parameter.data as ParameterTypeMap['number'];

                            return (
                                <div key={parameter.id} className="flex flex-col gap-1">
                                    <p className="text-sm truncate">{parameter.name}</p>

                                    <Input
                                        min={numberParameter.min}
                                        max={numberParameter.max}
                                        value={numberParameter.value.toString()}
                                        type="number"
                                        className="bg-depth-2 border border-depth-3 hover:bg-depth-3 active:bg-depth-4"
                                        onChange={(newValue) => {
                                            const numValue = parseFloat(newValue);
                                            if (!isNaN(numValue)) {
                                                let clampedValue = numValue;

                                                if (numberParameter.min !== undefined) {
                                                    clampedValue = Math.max(clampedValue, numberParameter.min);
                                                }

                                                if (numberParameter.max !== undefined) {
                                                    clampedValue = Math.min(clampedValue, numberParameter.max);
                                                }

                                                updateNodeParameter(node.id, parameter.id, {
                                                    data: {
                                                        ...numberParameter,
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
                                <div key={parameter.id} className="flex flex-col gap-1">
                                    <p className="text-sm truncate">{parameter.name}</p>

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
                                <label
                                    key={parameter.id}
                                    className="flex items-center w-full gap-1 select-none cursor-pointer truncate"
                                >
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
                            const enumParameter = parameter.data as ParameterTypeMap['enum'];

                            return (
                                <div key={parameter.id} className="flex flex-col gap-1">
                                    <p className="text-sm truncate">{parameter.name}:</p>

                                    <Select
                                        value={enumParameter.value}
                                        options={enumParameter.options}
                                        onChange={(newValue) => {
                                            updateNodeParameter(node.id, parameter.id, {
                                                data: {
                                                    ...enumParameter,
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
                    })}
                </div>
            )}

            <OptionPicker
                options={options}
                onSelect={(parameterId) => addParameterToNode(node.id, parameterId)}
                placeholder="Добавить параметр"
            />
        </div>
    );
});
