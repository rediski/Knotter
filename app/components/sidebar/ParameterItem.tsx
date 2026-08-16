'use client';

import { memo, useCallback, type MouseEvent } from 'react';

import type { Parameter } from '@/_core/_/parameter';

import { addSelectedParametersToNode } from '@/utils/nodes/addSelectedParametersToNode';
import { unassignParameter } from '@/utils/parameters/unassignParameter';

import { Plus, ScanBox, X } from 'lucide-react';

interface ParameterItemProps {
    parameter: Parameter;
    selectedIds: Set<string>;
    onSelect: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    hasParameterInNode: boolean;
    currentNodeId: string | null;
    handleDragStart: (e: React.DragEvent, id: string) => void;
}

export const ParameterItem = memo(function ParameterItem({
    parameter,
    selectedIds,
    onSelect,
    hasParameterInNode: hasParameter,
    currentNodeId,
    handleDragStart,
}: ParameterItemProps) {
    const isSelected = selectedIds.has(parameter.id);
    const isPartOfSelectionGroup = isSelected && selectedIds.size > 1;

    const handleClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            onSelect(parameter.id, e.ctrlKey || e.metaKey, e.shiftKey);
        },
        [parameter.id, onSelect],
    );

    const handleAddToNode = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (currentNodeId) {
                addSelectedParametersToNode(currentNodeId);
            }
        },
        [currentNodeId],
    );

    const handleRemoveFromNode = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (currentNodeId) {
                unassignParameter(parameter.id);
            }
        },
        [parameter.id, currentNodeId],
    );

    const renderActionButtons = () => {
        if (!currentNodeId) return null;

        return (
            <div className="flex gap-1 ml-auto">
                {hasParameter ? (
                    <button
                        onClick={handleRemoveFromNode}
                        className="p-1 rounded hover:bg-depth-3 text-red-500"
                        title="Удалить из ноды"
                    >
                        <X size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handleAddToNode}
                        className="p-1 rounded hover:bg-depth-3 text-green-500"
                        title="Добавить в ноду"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <li
            data-id={parameter.id}
            className="relative select-none cursor-grab"
            onClick={handleClick}
            onDragStart={(e) => handleDragStart(e, parameter.id)}
            draggable={true}
        >
            <div
                className={`
                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center text-nowrap
                    ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10' : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'}
                    ${isPartOfSelectionGroup && 'border-bg-accent/20'}
                `}
            >
                <div
                    className={`flex items-center gap-2 flex-1 min-w-0 ${isSelected ? 'text-text-accent' : 'text-foreground'}`}
                >
                    <ScanBox size={16} className={`min-w-4 ${isSelected ? 'text-text-accent' : 'text-foreground'}`} />

                    <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                    <span className="text-sm truncate">{parameter.name}</span>

                    {renderActionButtons()}
                </div>
            </div>
        </li>
    );
});
