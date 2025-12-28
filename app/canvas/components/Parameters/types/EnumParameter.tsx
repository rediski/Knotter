'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { X } from 'lucide-react';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { Parameter } from '@/canvas/utils/parameters/parameter.types';
import { isEnumValue } from '@/canvas/utils/parameters/parameter.type-guards';

interface EnumParameterProps {
    parameter: Parameter;
    handleAddEnumOption: () => void;
    handleRemoveEnumOption: (index: number) => void;
    handleUpdateEnumOption: (index: number, newValue: string) => void;
    handleUpdateParameterName: (newName: string) => void;
    removeParameter: (parameterId: string) => void;
}

export const EnumParameter = memo(function EnumParameter({
    parameter,
    handleAddEnumOption,
    handleRemoveEnumOption,
    handleUpdateEnumOption,
    handleUpdateParameterName,
    removeParameter,
}: EnumParameterProps) {
    const EnumIcon = getDynamicIcon('enum');
    const StringIcon = getDynamicIcon('string');

    if (!isEnumValue(parameter)) return null;

    const enumValue = parameter.value;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 rounded-md">
            <div className="flex items-center gap-1 h-8">
                <EnumIcon size={16} className="min-w-4" />

                <EditableName
                    name={parameter.name}
                    onChange={handleUpdateParameterName} // Исправлено
                    className="w-full"
                />

                <button onClick={() => removeParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                {enumValue.options.map((option, index) => (
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
                    className={`
                        flex flex-col gap-1 rounded-md p-2 border border-dashed border-depth-6 hover:bg-bg-accent/10 hover:border-text-accent cursor-pointer              
                        ${enumValue.options.length > 0 && 'mt-2'}
                    `}
                    onClick={handleAddEnumOption}
                >
                    <div className="flex flex-wrap items-center justify-center py-4 gap-2 text-center">
                        <span>Кликните чтобы добавить параметр</span>

                        <div className="flex items-center gap-2 bg-bg-accent/10 px-2 py-1 rounded-md text-text-accent">
                            <StringIcon size={16} /> Текст
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
