'use client';

import { memo, useCallback } from 'react';

import type { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';
import { updateNodeParameter } from '@/canvas/utils/parameters/updateNodeParameter';
import { removeParameterFromSelectedNode } from '@/canvas/utils/parameters/removeParameterFromSelectedNode';

import { X } from 'lucide-react';

export const LocalParameter = memo(function LocalParameter({ parameter, nodeId }: { parameter: Parameter; nodeId: string }) {
    const ParameterIcon = getParameterIcon(parameter.type);

    const handleRemove = useCallback(() => {
        removeParameterFromSelectedNode(parameter.id);
    }, [parameter.id]);

    const handleNumberChange = useCallback(
        (newValue: string | null) => {
            if (newValue === null) return;
            const numValue = parseFloat(newValue);
            if (isNaN(numValue)) return;

            updateNodeParameter(nodeId, parameter.id, {
                data: numValue,
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
        (newValue: string) => {
            updateNodeParameter(nodeId, parameter.id, {
                data: { value: newValue, options: (parameter.data as ParameterTypeMap['enum']).options },
            });
        },
        [parameter, nodeId],
    );

    const getCurrentEnumValue = useCallback(() => {
        const paramData = parameter.data as ParameterTypeMap['enum'];
        return paramData.value || paramData.options?.[0];
    }, [parameter.data]);

    return (
        <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
            {isNumber(parameter) && (
                <>
                    <div className="flex items-center gap-2 w-full truncate">
                        <ParameterIcon size={16} />
                        <p className="truncate">{parameter.name}</p>
                    </div>
                    <Input
                        value={parameter.data.toString()}
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
                <div className="flex items-center justify-between w-full">
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
                </div>
            )}

            {isEnum(parameter) && (
                <>
                    <div className="flex items-center gap-2 w-full truncate">
                        <ParameterIcon size={16} />
                        <p className="truncate">{parameter.name}</p>
                    </div>

                    <div className="w-full">
                        <DropdownAbsolute title={getCurrentEnumValue()} depth={3} align="right">
                            {(parameter.data as ParameterTypeMap['enum']).options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleEnumChange(option)}
                                    className={`
                                        w-full text-left px-3 py-1.5 rounded-md border cursor-pointer
                                        ${
                                            option === (parameter.data as ParameterTypeMap['enum']).value
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
            >
                <X size={16} />
            </button>
        </div>
    );
});
