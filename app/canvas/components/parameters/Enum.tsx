'use client';

import { memo } from 'react';

import { Parameter } from '@/canvas/_core/_/parameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { updateParameterName } from '@/canvas/utils/parameters/updateParameterName';
import { removeParameter } from '@/canvas/utils/parameters/removeParameter';

import { useEnum } from '@/canvas/components/parameters/useEnum';

import { List, PlusIcon, X } from 'lucide-react';

export const Enum = memo(function Enum({ parameter }: { parameter: Parameter }) {
    const { handleAddEnumOption, handleRemoveEnumOption, handleUpdateEnumOption } = useEnum({ parameter });

    if (!isEnum(parameter)) return null;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 border border-depth-3 rounded-md">
            <div className="flex items-center gap-2 h-8">
                <List size={16} className="min-w-4" />

                <EditableName
                    name={parameter.name}
                    onChange={(newName) => updateParameterName(parameter.id, newName)}
                    className="w-full"
                />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                {parameter.data.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center rounded-md">
                        <Input
                            value={option}
                            onChange={(val) => handleUpdateEnumOption(index, val)}
                            className="border bg-depth-3 border-depth-4"
                            max={16}
                            placeholder="Введите значение..."
                        />

                        <button onClick={() => handleRemoveEnumOption(index)} className="text-gray cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <div
                    className="flex m-auto items-center gap-2 px-3 py-1 bg-depth-3 hover:bg-depth-4 border border-depth-4 rounded-md cursor-pointer"
                    onClick={handleAddEnumOption}
                >
                    <PlusIcon size={16} /> Добавить опцию
                </div>
            </div>
        </div>
    );
});
