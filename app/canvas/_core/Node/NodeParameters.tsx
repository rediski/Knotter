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
import { removeParameterFromSelectedNode } from '@/canvas/utils/parameters/removeParameterFromSelectedNode';
import { updateNodeParameter } from '@/canvas/utils/parameters/updateNodeParameter';

import { X } from 'lucide-react';

export const NodeParameters = memo(function NodeParameters({ node }: { node: Node }) {
    const items = useItemsStore((state) => state.items);
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

    return (
        <div className="flex flex-col w-full gap-1 text-sm">
            {nodeParameters.length > 0 && (
                <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-3">
                    {nodeParameters.map((parameter: Parameter) => {
                        const ParameterIcon = getParameterIcon(parameter.type);

                        const parameterContent = (() => {
                            if (parameter.type === 'number') {
                                const parameterData = parameter.data as ParameterTypeMap['number'];

                                return (
                                    <div className="flex items-center gap-1 w-full">
                                        <div className="flex items-center gap-2 w-full truncate">
                                            <ParameterIcon size={16} />
                                            <p className="truncate">{parameter.name}</p>
                                        </div>

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
                                        <div className="flex items-center gap-2 w-full truncate">
                                            <ParameterIcon size={16} />
                                            <p className="truncate">{parameter.name}</p>
                                        </div>

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
                                    <label className="flex items-center justify-between w-full gap-1 select-none cursor-pointer">
                                        <div className="flex items-center gap-2 truncate">
                                            <ParameterIcon size={16} />
                                            <span className="truncate">{parameter.name}</span>
                                        </div>

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
                                        <div className="flex items-center gap-2 w-full truncate">
                                            <ParameterIcon size={16} />
                                            <p className="truncate">{parameter.name}</p>
                                        </div>

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

                            if (parameter.type === 'structure') {
                                return (
                                    <div className="flex items-center gap-1 w-full">
                                        <div className="flex items-center gap-2 truncate w-full">
                                            <ParameterIcon size={16} className="text-icon-secondary shrink-0" />
                                            <p className="truncate w-full">{parameter.name}</p>
                                        </div>

                                        <p className="flex items-center w-full h-8">В разработке...</p>
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
