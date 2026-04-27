'use client';

import { memo } from 'react';

import type { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';
import { updateNodeParameter } from '@/canvas/utils/parameters/updateNodeParameter';
import { unassignParameter } from '@/canvas/utils/parameters/unassignParameter';

import { X } from 'lucide-react';

export const LocalParameter = memo(function LocalParameter({ parameter, nodeId }: { parameter: Parameter; nodeId: string }) {
    const ParameterIcon = getParameterIcon(parameter.type);

    if (isNumber(parameter)) {
        const handleNumberChange = (newValue: string | null) => {
            if (newValue === null) return;

            const numValue = parseFloat(newValue);

            if (isNaN(numValue)) return;

            updateNodeParameter(nodeId, parameter.id, { value: numValue });
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{parameter.name}</p>
                </div>

                <Input
                    value={parameter.value?.toString() ?? '0'}
                    type="number"
                    className="bg-depth-3 border border-depth-4 hover:bg-depth-4"
                    onChange={handleNumberChange}
                />

                <button
                    onClick={() => unassignParameter(parameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (isString(parameter)) {
        const handleStringChange = (newValue: string | null) => {
            if (newValue === null) return;
            updateNodeParameter(nodeId, parameter.id, { value: newValue });
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{parameter.name}</p>
                </div>

                <Input
                    value={parameter.value ?? ''}
                    placeholder="Введите значение"
                    className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                    onChange={handleStringChange}
                />

                <button
                    onClick={() => unassignParameter(parameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (isBoolean(parameter)) {
        const handleBooleanChange = (checked: boolean) => {
            updateNodeParameter(nodeId, parameter.id, { value: checked });
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 truncate">
                        <ParameterIcon size={16} />
                        <span className="truncate">{parameter.name}</span>
                    </div>

                    <Checkbox
                        checked={parameter.value ?? false}
                        className={`
                            bg-depth-3 border border-depth-4
                            ${parameter.value === true ? 'hover:bg-bg-accent' : 'hover:bg-depth-4'}
                        `}
                        onChange={handleBooleanChange}
                    />
                </div>

                <button
                    onClick={() => unassignParameter(parameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (isEnum(parameter)) {
        const enumValue = parameter.value as ParameterTypeMap['enum'];

        const getCurrentEnumValue = () => {
            return enumValue?.selected || enumValue?.options?.[0] || '';
        };

        const handleEnumChange = (selected: string) => {
            const currentValue = enumValue || { options: [], selected: '' };
            updateNodeParameter(nodeId, parameter.id, {
                value: {
                    ...currentValue,
                    selected,
                },
            });
        };

        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 w-full truncate">
                    <ParameterIcon size={16} />
                    <p className="truncate">{parameter.name}</p>
                </div>

                <div className="w-full">
                    <DropdownAbsolute title={getCurrentEnumValue()} depth={3} align="right">
                        {enumValue?.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleEnumChange(option)}
                                className={`
                                    w-full text-left px-3 py-1.5 rounded-md border cursor-pointer
                                    ${
                                        option === enumValue?.selected
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
                    onClick={() => unassignParameter(parameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (isStructure(parameter)) {
        return (
            <div className="flex items-center gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 truncate w-full">
                    <ParameterIcon size={16} className="text-icon-secondary shrink-0" />
                    <p className="truncate w-full">{parameter.name}</p>
                </div>

                <p className="flex items-center w-full h-8">В разработке...</p>

                <button
                    onClick={() => unassignParameter(parameter.id)}
                    className="cursor-pointer text-gray hover:text-white min-w-4"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return null;
});
