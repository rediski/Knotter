'use client';

import { memo, useCallback, type MouseEvent } from 'react';

import type { Parameter } from '@/_core/_/parameter';
import { parameterTypes } from '@/_core/_/parameter';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EditableName } from '@/components/UI/EditableName';

import { getParameterIcon } from '@/utils/nodes/getParameterIcon';
import { updateParameterType } from '@/utils/parameters/updateParameterType';
import { updateParameterName } from '@/utils/parameters/updateParameterName';
import { updateParameter } from '@/utils/parameters/updateParameter';

interface ParameterItemProps {
    parameter: Parameter;
    selectedIds: Set<string>;
    onSelect: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    hasParameterInNode: boolean;
}

export const ParameterItem = memo(function ParameterItem({
    parameter,
    selectedIds,
    onSelect,
    hasParameterInNode,
}: ParameterItemProps) {
    const isSelected = selectedIds.has(parameter.id);

    const handleClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            onSelect(parameter.id, e.ctrlKey || e.metaKey, e.shiftKey);
        },
        [parameter.id, onSelect],
    );

    if (parameter.type === null) {
        return (
            <div
                onClick={handleClick}
                className={`
                    flex gap-2 px-3 py-1 text-sm border rounded-md items-center group cursor-grab select-none
                    ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-2 border-depth-3'}
                `}
            >
                <DropdownAbsolute title="Тип данных" depth={2} align="left">
                    {parameterTypes.map((type) => {
                        const Icon = getParameterIcon(type.type);
                        return (
                            <button
                                key={type.type}
                                onClick={() => updateParameterType(parameter.id, type.type)}
                                className="px-3 py-2 w-full flex items-center gap-2 text-left border rounded-md cursor-pointer hover:bg-depth-3"
                            >
                                <Icon size={16} />
                                <span>{type.label}</span>
                            </button>
                        );
                    })}
                </DropdownAbsolute>

                <span className="text-foreground/50">{parameter.name}</span>

                {hasParameterInNode && <span className="text-xs text-green-500 ml-auto">✓</span>}
            </div>
        );
    }

    if (parameter.type === 'number') {
        const handleNumberChange = (value: string | null) => {
            if (value === null) return;
            const numValue = parseFloat(value);
            if (isNaN(numValue)) return;
            updateParameter(parameter.id, { defaultValue: numValue });
        };

        return (
            <div
                onClick={handleClick}
                className={`
                    flex gap-2 px-3 py-1 text-sm border rounded-md items-center group cursor-grab select-none
                    ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-2 border-depth-3'}
                `}
            >
                <div className="flex items-center gap-2 h-8 w-full">
                    {!hasParameterInNode && <div className="min-w-2 h-2 bg-bg-accent rounded-full" />}

                    <EditableName
                        name={parameter.name}
                        onChange={(newName) => updateParameterName(parameter.id, newName)}
                        className="w-full text-json-number"
                        disabled={hasParameterInNode}
                    />

                    <Input
                        value={String(parameter.defaultValue ?? 0)}
                        onChange={handleNumberChange}
                        type="number"
                        placeholder="Введите значение"
                        disabled={hasParameterInNode}
                        className={`
                            border 
                            ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'} 
                            ${hasParameterInNode && 'cursor-not-allowed opacity-50'}
                        `}
                    />
                </div>
            </div>
        );
    }

    if (parameter.type === 'string') {
        const value = typeof parameter.defaultValue === 'string' ? parameter.defaultValue : '';

        return (
            <div
                onClick={handleClick}
                className={`
                    flex gap-2 px-3 py-1 text-sm border rounded-md items-center group cursor-grab select-none
                    ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-2 border-depth-3'}
                `}
            >
                <div className="flex items-center gap-2 h-8 w-full">
                    {!hasParameterInNode && <div className="min-w-2 h-2 bg-bg-accent rounded-full" />}

                    <EditableName
                        name={parameter.name}
                        onChange={(newName) => updateParameterName(parameter.id, newName)}
                        className="w-full text-json-string"
                        disabled={hasParameterInNode}
                    />

                    <Input
                        value={value}
                        onChange={(newValue) => {
                            if (newValue === null) return;
                            updateParameter(parameter.id, { defaultValue: newValue });
                        }}
                        placeholder="Введите значение"
                        disabled={hasParameterInNode}
                        className={`
                            border 
                            ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                            ${hasParameterInNode && 'cursor-not-allowed opacity-50'}
                        `}
                    />
                </div>
            </div>
        );
    }

    if (parameter.type === 'boolean') {
        const checkedValue = parameter.defaultValue === true;

        return (
            <div
                onClick={handleClick}
                className={`
                    flex gap-2 px-3 py-1 text-sm border rounded-md items-center group cursor-grab select-none
                    ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-2 border-depth-3'}
                `}
            >
                <div className="flex items-center gap-2 h-8 w-full">
                    {!hasParameterInNode && <div className="min-w-2 h-2 bg-bg-accent rounded-full" />}

                    <EditableName
                        name={parameter.name}
                        onChange={(newName) => updateParameterName(parameter.id, newName)}
                        className="w-full text-json-boolean"
                        disabled={hasParameterInNode}
                    />

                    <div className={`w-full ${hasParameterInNode && 'opacity-50'}`}>
                        <Checkbox
                            checked={checkedValue}
                            onChange={(checked) => updateParameter(parameter.id, { defaultValue: checked })}
                            disabled={hasParameterInNode}
                            className={`
                                border
                                ${hasParameterInNode && 'cursor-not-allowed'}
                                ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-3 border-depth-4'}
                            `}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (parameter.type === 'enum') {
        const options = Array.isArray(parameter.defaultValue) ? parameter.defaultValue : [];

        return (
            <div
                onClick={handleClick}
                className={`
                    flex gap-2 px-3 py-1 text-sm border rounded-md items-center group cursor-grab select-none
                    ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10' : 'bg-depth-2 border-depth-3'}
                `}
            >
                <div className="flex gap-6 w-full">
                    <div className="flex items-center gap-2 h-8 w-full flex-1">
                        {!hasParameterInNode && <div className="w-2 h-2 bg-bg-accent rounded-full" />}

                        <EditableName
                            name={parameter.name}
                            onChange={(newName) => updateParameterName(parameter.id, newName)}
                            className="w-full text-json-brackets"
                            disabled={hasParameterInNode}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full flex-1">
                        <button
                            onClick={() => {
                                const newOptions = [...options, ''];
                                updateParameter(parameter.id, { defaultValue: newOptions });
                            }}
                            disabled={hasParameterInNode}
                            className={`
                                flex items-center justify-center gap-2 px-3 py-1 border rounded-md
                                ${!hasParameterInNode && 'hover:bg-depth-4 cursor-pointer bg-depth-3 border-depth-4'}
                                ${hasParameterInNode && 'opacity-50 cursor-not-allowed'}
                            `}
                        >
                            + Добавить опцию
                        </button>

                        {options.map((option: string, index: number) => (
                            <div key={index} className="flex gap-2 items-center rounded-md relative">
                                <Input
                                    value={option}
                                    onChange={(value) => {
                                        if (value === null) return;
                                        const newOptions = [...options];
                                        newOptions[index] = value;
                                        updateParameter(parameter.id, { defaultValue: newOptions });
                                    }}
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
                                    onClick={() => {
                                        const newOptions = options.filter((_, i) => i !== index);
                                        updateParameter(parameter.id, { defaultValue: newOptions });
                                    }}
                                    className="text-gray absolute right-3"
                                    disabled={hasParameterInNode}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
});
