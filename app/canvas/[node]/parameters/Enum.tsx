'use client';

import { memo } from 'react';

import { Parameter, ParameterDefaultValue } from '@/canvas/_core/_/parameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

import { useEnum } from '@/canvas/[node]/parameters/useEnum';

import { PlusIcon, X } from 'lucide-react';

export const Enum = memo(function Enum({
    parameter,
    isSelected,
    hasParameterInNode,
}: {
    parameter: Parameter;
    isSelected: boolean;
    hasParameterInNode: boolean;
}) {
    const { addEnumOption, removeEnumOption, updateEnumOption } = useEnum({ parameter });

    if (!isEnum(parameter)) return null;

    const options = parameter.defaultValue as ParameterDefaultValue['enum'];

    return (
        <div className="flex gap-6 w-full">
            <div className="flex items-center gap-2 h-8 w-full flex-1">
                {!hasParameterInNode && <div className="w-2 h-2 bg-json-brackets rounded-full" />}

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-brackets"
                    disabled={hasParameterInNode}
                />
            </div>

            <div className="flex flex-col gap-1 w-full flex-1">
                <button
                    onClick={addEnumOption}
                    disabled={hasParameterInNode}
                    className={`
                        flex items-center justify-center gap-2 px-3 py-1 border rounded-md              
                        ${!hasParameterInNode && !isSelected && 'hover:bg-depth-4 active:bg-depth-4 bg-depth-3 border-depth-4 cursor-pointer'}
                        ${!hasParameterInNode && isSelected && 'hover:bg-bg-accent/15 active:bg-bg-accent/20 bg-bg-accent/10 border-bg-accent/10 cursor-pointer'}
                        ${hasParameterInNode && !isSelected && 'opacity-50 cursor-not-allowed bg-depth-3 border-depth-4'}
                        ${hasParameterInNode && isSelected && 'opacity-50 cursor-not-allowed bg-bg-accent/10 border-bg-accent/10'}           
                    `}
                >
                    <PlusIcon size={16} /> Добавить опцию
                </button>

                {options.map((option: string, index: number) => (
                    <div
                        key={index}
                        className={`
                            flex gap-2 items-center rounded-md relative
                            ${hasParameterInNode && 'opacity-50'}
                        `}
                    >
                        <Input
                            value={option}
                            onChange={(value) => updateEnumOption(index, value)}
                            max={16}
                            disabled={hasParameterInNode}
                            placeholder="Введите значение"
                            className={`
                                border
                                ${hasParameterInNode ? 'cursor-not-allowed' : 'cursor-text'}
                                ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                            `}
                        />

                        <button
                            onClick={() => removeEnumOption(index)}
                            className={`
                                text-gray absolute right-3
                                ${hasParameterInNode ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            disabled={hasParameterInNode}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});
