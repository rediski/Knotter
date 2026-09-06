'use client';

import { EmptyState } from '@/components/UI/EmptyState';

import { ParameterItem } from '@/components/sidebar/ParameterItem';

import { useItemsStore } from '@/store/useItemsStore';

import { generateUniqueName } from '@/utils/items/generateUniqueName';

import { createParameter } from '@/utils/parameters/createParameter';

import { Plus } from 'lucide-react';
import { getVisibleSelectedParametersCount } from '@/utils/parameters/getVisibleSelectedParametersCount';

import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { Parameter } from '@/_core/_/parameter';

import { handleDragReorderParameters } from '@/utils/parameters/handleDragReorderParameters';

export const Parameters = () => {
    const parameters = useItemsStore((state) => state.parameters);
    const selectedParameterIds = useItemsStore((state) => state.selectedParameterIds);
    const setSelectedParameterIds = useItemsStore((state) => state.setSelectedParameterIds);

    const { listRef, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop<Parameter>({
        items: parameters,
        selectedIds: selectedParameterIds,
        onSelect: (ids) => setSelectedParameterIds(ids),
        onReorder: handleDragReorderParameters,
        itemSelector: 'li',
    });

    const baseName = 'Параметр';

    const name = generateUniqueName(
        baseName,
        parameters.map((parameter) => parameter.name),
    );

    const visibleSelectedParametersCount = getVisibleSelectedParametersCount(parameters);

    return (
        <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-8px-32px-4px)] h-full mt-1">
            <div className="px-1">
                <button
                    onClick={() => createParameter(name)}
                    className="flex items-center gap-2 w-full min-h-9 px-3 py-1 rounded-md cursor-pointer bg-depth-2 hover:bg-depth-3 active:bg-depth-4 text-foreground border border-depth-3 text-sm"
                >
                    <Plus size={16} />
                    <span>Создать</span>
                </button>
            </div>

            <ul
                className="flex flex-col gap-1 p-1 list-none relative h-full"
                ref={listRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setSelectedParameterIds([]);
                    }
                }}
            >
                {parameters.length > 0 ? (
                    <>
                        {visibleSelectedParametersCount > 1 && (
                            <div className="text-xs text-text-accent px-3 py-1 bg-bg-accent rounded-md truncate">
                                Выбранных параметров: {visibleSelectedParametersCount}
                            </div>
                        )}

                        {parameters.map((parameter) => (
                            <ParameterItem key={parameter.id} parameter={parameter} handleDragStart={handleDragStart} />
                        ))}
                    </>
                ) : (
                    <EmptyState
                        message={parameters.length === 0 ? 'Параметры не найдены' : 'Параметры с таким именем не найдены'}
                    />
                )}
            </ul>
        </div>
    );
};
