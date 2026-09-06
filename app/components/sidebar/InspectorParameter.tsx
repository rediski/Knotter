'use client';

import { memo } from 'react';

import { parameterTypes, type Parameter } from '@/_core/_/parameter';
import { getParameterIcon } from '@/utils/parameters/getParameterIcon';

import { Checkbox } from '@/components/UI/Checkbox';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { Dropdown } from '@/components/UI/Dropdown';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { useDropdownStore } from '@/store/useDropdownStore';

import { changeParameterName } from '@/utils/parameters/changeParameterName';
import { changeParameterDescription } from '@/utils/parameters/changeParameterDescription';
import { changeParameterType } from '@/utils/parameters/changeParameterType';
import { changeParameterDefaultValue } from '@/utils/parameters/changeParameterDefaultValue';

import { Plus, ScanBox, X } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Наименование',
    DESCRIPTION: 'Описание',
    TYPE: 'Тип',
    DEFAULT_VALUE: 'Значение по умолчанию',
    VALUE: 'Текущее значение',
} as const;

interface InspectorParameterProps {
    parameter: Parameter;
}

export const InspectorParameter = memo(function InspectorParameter({ parameter }: InspectorParameterProps) {
    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const handleNameChange = (value: string) => {
        changeParameterName(parameter.id, value);
    };

    const handleDescriptionChange = (value: string) => {
        changeParameterDescription(parameter.id, value);
    };

    const renderDefaultValueInput = () => {
        if (!parameter.type) return null;

        switch (parameter.type) {
            case 'string':
                return (
                    <Input
                        value={(parameter.defaultValue as string) || ''}
                        onChange={(value) => changeParameterDefaultValue(parameter.id, value)}
                        placeholder="Введите текст"
                        className="bg-depth-3 border border-depth-4"
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        value={String(parameter.defaultValue || 0)}
                        onChange={(value) => {
                            const num = value === '' ? null : Number(value);
                            changeParameterDefaultValue(parameter.id, num);
                        }}
                        placeholder="0"
                        className="bg-depth-3 border border-depth-4"
                        allowNegative={true}
                        allowDecimal={true}
                    />
                );
            case 'boolean':
                return (
                    <Checkbox
                        checked={Boolean(parameter.defaultValue)}
                        onChange={(checked: boolean) => changeParameterDefaultValue(parameter.id, checked)}
                        className="bg-depth-3 border border-depth-4"
                    />
                );
            case 'enum': {
                const enumValues = Array.isArray(parameter.defaultValue) ? parameter.defaultValue : [];

                const generateUniqueName = (baseName: string, existingValues: string[]) => {
                    if (!baseName) return '';

                    if (!existingValues.includes(baseName)) {
                        return baseName;
                    }

                    let counter = 1;
                    let newName = `${baseName} (${counter})`;

                    while (existingValues.includes(newName)) {
                        counter++;
                        newName = `${baseName} (${counter})`;
                    }
                    return newName;
                };

                const handleAddValue = () => {
                    const newEnumValues = [...enumValues, ''];
                    changeParameterDefaultValue(parameter.id, newEnumValues);
                };

                const handleChangeValue = (index: number, newValue: string) => {
                    const newEnumValues = [...enumValues];
                    newEnumValues[index] = newValue;

                    const duplicates = newEnumValues.filter((v, i) => v && v === newValue && i !== index);

                    if (duplicates.length > 0) {
                        const uniqueName = generateUniqueName(
                            newValue,
                            newEnumValues.filter((_, i) => i !== index),
                        );
                        newEnumValues[index] = uniqueName;
                    }

                    changeParameterDefaultValue(parameter.id, newEnumValues);
                };

                return (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={handleAddValue}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm hover:text-contrast border border-depth-4 rounded-md bg-depth-3 hover:bg-depth-4 cursor-pointer"
                        >
                            <Plus size={16} /> Добавить значение
                        </button>

                        <div className="flex flex-col gap-1">
                            {enumValues.map((value, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={value}
                                        onChange={(newValue) => handleChangeValue(index, newValue)}
                                        placeholder={`Значение ${index + 1}`}
                                        className="bg-depth-3 border border-depth-4 flex-1"
                                    />

                                    <button
                                        onClick={() => {
                                            const newEnumValues = enumValues.filter((_, i) => i !== index);
                                            changeParameterDefaultValue(parameter.id, newEnumValues);
                                        }}
                                        className="p-2 text-gray hover:text-foreground cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col px-1 gap-1">
            <div className="flex flex-col gap-1 pt-1">
                <Input
                    value={parameter.name}
                    onChange={handleNameChange}
                    placeholder={FIELD_TITLES.NAME}
                    icon={ScanBox}
                    className="bg-depth-2 border border-depth-3"
                />
            </div>

            <div className="flex flex-col gap-1">
                <Textarea
                    value={parameter.description}
                    onChange={handleDescriptionChange}
                    placeholder={FIELD_TITLES.DESCRIPTION}
                    className="border border-depth-3"
                />
            </div>

            <Dropdown title={FIELD_TITLES.TYPE} isOpen={isDropdownOpen(100)} onToggle={() => toggleDropdown(100)}>
                <DropdownAbsolute
                    title={
                        parameter.type
                            ? parameterTypes.find((t) => t.type === parameter.type)?.label || 'Не выбран'
                            : 'Не выбран'
                    }
                    depth={3}
                    icon={getParameterIcon(parameter.type)}
                >
                    <div className="flex flex-col gap-1">
                        {parameterTypes.map((typeOption) => {
                            const IconComponent = getParameterIcon(typeOption.type);
                            return (
                                <button
                                    key={typeOption.type}
                                    onClick={() => changeParameterType(parameter.id, typeOption.type)}
                                    className={`
                                            w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer
                                            ${
                                                parameter.type === typeOption.type
                                                    ? 'bg-bg-accent text-text-accent border border-border-accent'
                                                    : 'hover:bg-depth-4 text-contrast'
                                            }
                                        `}
                                >
                                    <div className="flex items-center gap-2">
                                        <IconComponent size={16} />
                                        <span>{typeOption.label}</span>
                                    </div>
                                </button>
                            );
                        })}

                        <button
                            onClick={() => changeParameterType(parameter.id, null)}
                            className={`
                                    w-full text-left px-3 py-2 text-sm rounded-md
                                    ${
                                        !parameter.type
                                            ? 'bg-bg-accent text-text-accent border border-border-accent'
                                            : 'hover:bg-depth-4 text-contrast'
                                    }
                                `}
                        >
                            <div className="flex items-center gap-2">
                                <ScanBox size={16} />
                                <span>Не выбран</span>
                            </div>
                        </button>
                    </div>
                </DropdownAbsolute>
            </Dropdown>

            {parameter.type && (
                <Dropdown
                    title={FIELD_TITLES.DEFAULT_VALUE}
                    isOpen={isDropdownOpen(101)}
                    onToggle={() => toggleDropdown(101)}
                >
                    <div className="flex flex-col gap-1">{renderDefaultValueInput()}</div>
                </Dropdown>
            )}

            <span className="text-xs text-gray text-right p-1 select-text">{parameter.id}</span>
        </div>
    );
});
