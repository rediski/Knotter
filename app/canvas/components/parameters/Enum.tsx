'use client';

import { memo } from 'react';

import { Parameter } from '@/canvas/_core/_/parameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';

import { useEnum } from '@/canvas/components/parameters/useEnum';

import { PlusIcon, X } from 'lucide-react';

export const Enum = memo(function Enum({ parameter, isSelected }: { parameter: Parameter; isSelected: boolean }) {
    const { addEnumOption, removeEnumOption, updateEnumOption } = useEnum({ parameter });

    if (!isEnum(parameter)) return null;

    const options = parameter.defaultValue?.options || [];

    return (
        <div className="flex gap-6 w-full">
            <div className="flex items-center gap-2 h-8 w-full flex-1">
                <div className="w-2 h-2 bg-json-brackets rounded-full" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full text-json-brackets"
                />
            </div>

            <div className="flex flex-col gap-1 w-full flex-1">
                <div
                    onClick={addEnumOption}
                    className={`
                        flex items-center justify-center gap-2 px-3 py-1 border rounded-md cursor-pointer
                        ${isSelected ? 'bg-bg-accent/10 hover:bg-bg-accent/15 active:bg-bg-accent/20 border-bg-accent/10' : 'bg-depth-3 hover:bg-depth-4 active:bg-depth-5 border-depth-4'}
                    `}
                >
                    <PlusIcon size={16} /> Добавить опцию
                </div>

                {options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center rounded-md relative">
                        <Input
                            value={option}
                            onChange={(value) => updateEnumOption(index, value)}
                            className={`
                                border 
                                ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                            `}
                            max={16}
                            placeholder="Введите значение"
                        />

                        <button
                            onClick={() => removeEnumOption(index)}
                            className="text-gray cursor-pointer absolute right-3"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});
