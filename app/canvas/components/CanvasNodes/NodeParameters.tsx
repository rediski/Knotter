'use client';

import { memo } from 'react';

import type { Node } from '@/canvas/canvas.types';
import type { EnumConfig, NumberConfig, Parameter } from '@/canvas/utils/parameters/parameter.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useParameters } from '@/canvas/hooks/Parameters/_core/useParameters';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { OptionPicker } from '@/components/UI/OptionPicker';
import { InfiniteSlider } from '@/components/UI/InfiniteSlider';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';

interface NodeParametersProps {
    node: Node;
}

export const NodeParameters = memo(function NodeParameters({ node }: NodeParametersProps) {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);

    const { parameters, addParameterToNode } = useParameters();

    const storeNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;

    const nodeParameters = storeNode?.nodeParameters ?? [];

    const filteredParameters = parameters.filter(
        (template) => !nodeParameters.some((nodeParam) => nodeParam.id === template.id),
    );

    const options = filteredParameters.map((param) => ({
        value: param.id,
        label: param.name,
        icon: getDynamicIcon(param.type),
    }));

    const updateNodeParameter = (nodeId: string, parameterId: string, updates: Partial<Parameter>) => {
        const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
        if (nodeIndex === -1) return;

        const currentNode = items[nodeIndex] as Node;

        const updatedNodeParameters = currentNode.nodeParameters.map((param) =>
            param.id === parameterId ? { ...param, ...updates } : param,
        );

        const updatedNode: Node = {
            ...currentNode,
            nodeParameters: updatedNodeParameters,
        };

        const updatedItems = [...items];
        updatedItems[nodeIndex] = updatedNode;

        setItems(updatedItems);
    };

    return (
        <div className="flex flex-col w-full gap-1">
            {nodeParameters.length > 0 && (
                <div className="flex flex-col gap-1">
                    {nodeParameters.map((parameter: Parameter) => {
                        if (parameter.type === 'number') {
                            const numberValue = parameter.value as NumberConfig;

                            return (
                                <div key={parameter.id}>
                                    <InfiniteSlider
                                        name={parameter.name}
                                        min={numberValue.min}
                                        max={numberValue.max}
                                        value={numberValue.currentValue}
                                        step={numberValue.step}
                                        showFill
                                        className="bg-depth-1 hover:bg-depth-2 active:bg-depth-3"
                                        onChange={(value) => {
                                            updateNodeParameter(node.id, parameter.id, {
                                                value: {
                                                    ...numberValue,
                                                    currentValue: value,
                                                },
                                            });
                                        }}
                                    />
                                </div>
                            );
                        }

                        if (parameter.type === 'string') {
                            return (
                                <div key={parameter.id} className="flex items-center gap-2">
                                    <span className="max-w-24 w-full truncate">{parameter.name}:</span>

                                    <Input
                                        value={parameter.value as string}
                                        onChange={(newValue) => {
                                            updateNodeParameter(node.id, parameter.id, {
                                                value: newValue,
                                            });
                                        }}
                                        placeholder="Введите текст"
                                        className="bg-depth-1 hover:bg-depth-2 active:bg-depth-3"
                                    />
                                </div>
                            );
                        }

                        if (parameter.type === 'boolean') {
                            return (
                                <div key={parameter.id} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={parameter.value as boolean}
                                        onChange={(checked) => {
                                            updateNodeParameter(node.id, parameter.id, {
                                                value: checked,
                                            });
                                        }}
                                        className={`bg-depth-1 ${
                                            parameter.value === true
                                                ? 'hover:bg-bg-accent'
                                                : 'hover:bg-depth-2 active:bg-depth-3'
                                        }`}
                                    />
                                    <span className="w-full truncate">{parameter.name}</span>
                                </div>
                            );
                        }

                        if (parameter.type === 'enum') {
                            const enumValue = parameter.value as EnumConfig;

                            if (enumValue.currentValue === null) return;

                            return (
                                <div key={parameter.id} className="flex items-center gap-2">
                                    <span className="max-w-24 w-full truncate">{parameter.name}:</span>

                                    <Select
                                        value={enumValue.currentValue}
                                        options={enumValue.options.map((opt) => ({
                                            value: opt.value,
                                            label: opt.value,
                                        }))}
                                        onChange={(newValue) => {
                                            updateNodeParameter(node.id, parameter.id, {
                                                value: { ...enumValue, currentValue: newValue },
                                            });
                                        }}
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
