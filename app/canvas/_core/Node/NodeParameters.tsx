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

    const availableOptions = parameters
        .filter((template) => !nodeParameters.some((nodeParam) => nodeParam.id === template.id))
        .map((param) => ({
            value: param.id,
            label: param.name,
            icon: getParameterIcon(param.type),
        }));

    return (
        <div className="flex flex-col w-full max-w-2xl gap-1 text-sm">
            {nodeParameters.length > 0 && (
                <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1">
                    {nodeParameters.map((parameter: Parameter) => {
                        const ParameterIcon = getParameterIcon(parameter.type);

                        return (
                            <div
                                key={parameter.id}
                                className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1"
                            >
                                {parameter.type === 'number' && (
                                    <div className="flex items-center gap-1 w-full">
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

                                                updateNodeParameter(node.id, parameter.id, {
                                                    data: { ...paramData, value: clampedValue },
                                                });
                                            }}
                                        />
                                    </div>
                                )}

                                {parameter.type === 'string' && (
                                    <div className="flex items-center gap-1 w-full">
                                        <div className="flex items-center gap-2 w-full truncate">
                                            <ParameterIcon size={16} />
                                            <p className="truncate">{parameter.name}</p>
                                        </div>

                                        <Input
                                            value={parameter.data as string}
                                            onChange={(newValue) => {
                                                updateNodeParameter(node.id, parameter.id, { data: newValue });
                                            }}
                                            placeholder="Введите значение"
                                            className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                                        />
                                    </div>
                                )}

                                {parameter.type === 'boolean' && (
                                    <label className="flex items-center justify-between w-full gap-1 select-none cursor-pointer">
                                        <div className="flex items-center gap-2 truncate">
                                            <ParameterIcon size={16} />
                                            <span className="truncate">{parameter.name}</span>
                                        </div>

                                        <Checkbox
                                            checked={parameter.data as boolean}
                                            onChange={(checked) => {
                                                updateNodeParameter(node.id, parameter.id, { data: checked });
                                            }}
                                            className={`
                                                bg-depth-3 border border-depth-4
                                                ${parameter.data === true ? 'hover:bg-bg-accent' : 'hover:bg-depth-4'}
                                            `}
                                        />
                                    </label>
                                )}

                                {parameter.type === 'enum' && (
                                    <div className="flex items-center gap-1 w-full">
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

                                                updateNodeParameter(node.id, parameter.id, {
                                                    data: { ...paramData, value: newValue },
                                                });
                                            }}
                                        />
                                    </div>
                                )}

                                {parameter.type === 'structure' && (
                                    <div className="flex items-center gap-1 w-full">
                                        <div className="flex items-center gap-2 truncate w-full">
                                            <ParameterIcon size={16} className="text-icon-secondary shrink-0" />
                                            <p className="truncate w-full">{parameter.name}</p>
                                        </div>
                                        <p className="flex items-center w-full h-8">В разработке...</p>
                                    </div>
                                )}

                                <X
                                    size={16}
                                    onClick={() => removeParameterFromSelectedNode(parameter.id)}
                                    className="cursor-pointer text-gray"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <OptionPicker
                options={availableOptions}
                onSelect={(parameterId) => addParameterToSelectedNode(parameterId)}
                placeholder="Добавить параметр"
            />
        </div>
    );
});
