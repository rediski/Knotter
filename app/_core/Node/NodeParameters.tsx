'use client';

import { memo, useState, useCallback, useMemo } from 'react';

import type { Parameter } from '@/_core/_/parameter';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { useItemsStore } from '@/store/useItemsStore';

import { getParameterIcon } from '@/utils/parameters/getParameterIcon';
import { updateNodeParameter } from '@/utils/parameters/updateNodeParameter';
import { unassignParameter } from '@/utils/parameters/unassignParameter';
import { addSelectedParametersToNode } from '@/utils/nodes/addSelectedParametersToNode';

import { X } from 'lucide-react';

export const NodeParameters = memo(function NodeParameters({
    nodeParameters = [],
    nodeId,
}: {
    nodeParameters?: Parameter[];
    nodeId: string;
}) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
    const [selectedAddIds, setSelectedAddIds] = useState<string[]>([]);

    const { parameters } = useItemsStore();

    const validNodeParameters = useMemo(
        () => nodeParameters.filter((p) => p?.type !== null && p?.type !== undefined),
        [nodeParameters],
    );

    const existingParameterIds = useMemo(() => new Set(validNodeParameters.map((p) => p.id)), [validNodeParameters]);

    const availableParameters = useMemo(
        () => parameters.filter((p) => !existingParameterIds.has(p.id) && p.type !== null && p.type !== undefined),
        [parameters, existingParameterIds],
    );

    const handleAddSelected = useCallback(() => {
        if (selectedAddIds.length === 0) return;

        addSelectedParametersToNode(nodeId, selectedAddIds);
        setSelectedAddIds([]);
        setIsAddDropdownOpen(false);
    }, [nodeId, selectedAddIds]);

    const handleToggleAddSelection = useCallback((id: string) => {
        setSelectedAddIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }, []);

    if (!Array.isArray(nodeParameters)) {
        return (
            <div className="text-gray bg-depth-2 w-full p-4 rounded-md border border-depth-3 text-center">
                Нет добавленных параметров
            </div>
        );
    }

    const handleSelect = useCallback(
        (id: string, ctrlKey: boolean, shiftKey: boolean) => {
            setSelectedIds((prev) => {
                if (shiftKey && prev.length > 0) {
                    const currentIndex = validNodeParameters.findIndex((p) => p.id === id);
                    const lastIndex = validNodeParameters.findIndex((p) => p.id === prev[prev.length - 1]);

                    if (currentIndex === -1 || lastIndex === -1) return prev;

                    const start = Math.min(currentIndex, lastIndex);
                    const end = Math.max(currentIndex, lastIndex);
                    const rangeIds = validNodeParameters.slice(start, end + 1).map((p) => p.id);
                    return Array.from(new Set([...prev, ...rangeIds]));
                }

                if (ctrlKey) {
                    return prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id];
                }

                return [id];
            });
        },
        [validNodeParameters],
    );

    const renderParameter = useCallback(
        (parameter: Parameter) => {
            if (!parameter || parameter.type === null || parameter.type === undefined) {
                return null;
            }

            const ParameterIcon = getParameterIcon(parameter.type);
            const isSelected = selectedIds.includes(parameter.id);
            const globalParameter = parameters.find((p) => p.id === parameter.id);

            const handleClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                handleSelect(parameter.id, e.ctrlKey || e.metaKey, e.shiftKey);
            };

            const renderRemoveButton = () => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        unassignParameter(parameter.id);
                    }}
                    className="cursor-pointer text-gray hover:text-foreground min-w-4"
                >
                    <X size={16} />
                </button>
            );

            const baseClassName = `
                flex items-center gap-2 bg-depth-2 border rounded-md px-3 py-1
                ${isSelected ? 'border-bg-accent/30 bg-bg-accent/5' : 'border-depth-3'}
                cursor-pointer hover:border-bg-accent/20
            `;

            if (parameter.type === 'number') {
                return (
                    <div key={parameter.id} className={baseClassName} onClick={handleClick}>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>

                        <Input
                            value={typeof parameter.value === 'number' ? parameter.value.toString() : '0'}
                            type="number"
                            className="bg-depth-3 border border-depth-4 hover:bg-depth-4"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(newValue) => {
                                if (newValue === null) return;
                                const numValue = parseFloat(newValue);
                                if (isNaN(numValue)) return;
                                updateNodeParameter(nodeId, parameter.id, numValue);
                            }}
                        />

                        {renderRemoveButton()}
                    </div>
                );
            }

            if (parameter.type === 'string') {
                return (
                    <div key={parameter.id} className={baseClassName} onClick={handleClick}>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} />
                            <p className="truncate">{parameter.name}</p>
                        </div>

                        <Input
                            value={typeof parameter.value === 'string' ? parameter.value : ''}
                            placeholder="Введите значение"
                            className="bg-depth-3 hover:bg-depth-4 border border-depth-4"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(newValue) => {
                                if (newValue === null) return;
                                updateNodeParameter(nodeId, parameter.id, newValue);
                            }}
                        />

                        {renderRemoveButton()}
                    </div>
                );
            }

            if (parameter.type === 'boolean') {
                return (
                    <div key={parameter.id} className={baseClassName} onClick={handleClick}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 truncate">
                                <ParameterIcon size={16} />
                                <span className="truncate">{parameter.name}</span>
                            </div>

                            <Checkbox
                                checked={typeof parameter.value === 'boolean' ? parameter.value : false}
                                className="bg-depth-3 border border-depth-4"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(checked) => updateNodeParameter(nodeId, parameter.id, checked)}
                            />
                        </div>

                        {renderRemoveButton()}
                    </div>
                );
            }

            if (parameter.type === 'enum') {
                const options = Array.isArray(globalParameter?.defaultValue) ? globalParameter.defaultValue : [];
                const selectedValue = typeof parameter.value === 'string' ? parameter.value : null;

                return (
                    <div key={parameter.id} className={baseClassName} onClick={handleClick}>
                        <div className="flex items-center gap-2 w-full truncate">
                            <ParameterIcon size={16} className="min-w-4" />
                            <p className="truncate">{parameter.name}</p>
                        </div>

                        <div className="w-full" onClick={(e) => e.stopPropagation()}>
                            <DropdownAbsolute title={selectedValue || (options[0] as string) || ''} depth={3} align="right">
                                {options.map((option: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => updateNodeParameter(nodeId, parameter.id, option)}
                                        className={`
                                            w-full text-left px-3 py-1.5 rounded-md border cursor-pointer
                                            ${
                                                option === selectedValue
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

                        {renderRemoveButton()}
                    </div>
                );
            }

            return null;
        },
        [selectedIds, handleSelect, nodeId, parameters],
    );

    return (
        <div className="flex flex-col gap-1">
            {isAddDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-72 overflow-y-auto bg-depth-2 border border-depth-3 rounded-md shadow-lg z-10 py-1">
                    {availableParameters.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-foreground/50">Нет доступных параметров</div>
                    ) : (
                        <>
                            <div className="border-t border-depth-3 mt-1 pt-1 px-2">
                                <button
                                    onClick={handleAddSelected}
                                    disabled={selectedAddIds.length === 0}
                                    className={`w-full px-3 py-1.5 text-sm rounded-md ${
                                        selectedAddIds.length > 0
                                            ? 'bg-bg-accent/10 text-text-accent hover:bg-bg-accent/15'
                                            : 'bg-depth-3 text-foreground/30 cursor-not-allowed'
                                    }`}
                                >
                                    Добавить выбранные ({selectedAddIds.length})
                                </button>
                            </div>

                            {availableParameters.map((param) => {
                                const Icon = getParameterIcon(param.type);
                                const isChecked = selectedAddIds.includes(param.id);

                                return (
                                    <div
                                        key={param.id}
                                        onClick={() => handleToggleAddSelection(param.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 hover:bg-depth-3 cursor-pointer ${
                                            isChecked ? 'bg-bg-accent/5' : ''
                                        }`}
                                    >
                                        <Checkbox checked={isChecked} onChange={() => {}} className="pointer-events-none" />

                                        <Icon size={14} className="min-w-4" />
                                        <span className="text-sm truncate flex-1">{param.name}</span>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}

            {validNodeParameters.length === 0 ? (
                <div className="text-gray bg-depth-2 w-full p-4 rounded-md border border-depth-3 text-center">
                    Нет добавленных параметров
                </div>
            ) : (
                <div className="flex flex-col gap-1">{validNodeParameters.map(renderParameter)}</div>
            )}
        </div>
    );
});
