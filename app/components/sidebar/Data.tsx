'use client';

import type { DataViewMode } from '@/store/useSidebarStore';

import { useState, useMemo, useEffect } from 'react';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { EmptyState } from '@/components/UI/EmptyState';
import { KeyFilters } from '@/components/sidebar/KeyFilters';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

const VIEW_LABELS: Record<DataViewMode, string> = {
    items: 'Элементы',
    parameters: 'Параметры',
};

export const Data = () => {
    const parameters = useItemsStore((state) => state.parameters);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const scenes = useItemsStore((state) => state.scenes);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const { showFilters, toggleShowFilters, dataViewMode, setDataViewMode } = useSidebarStore();

    const selectedItems = useMemo(() => {
        const scene = currentSceneId ? scenes[currentSceneId] : null;
        const items = scene?.items ?? [];
        const selectedIdsSet = new Set(selectedItemIds);

        return items.filter((item) => selectedIdsSet.has(item.id));
    }, [currentSceneId, scenes, selectedItemIds]);

    const data = useMemo(() => {
        if (dataViewMode === 'parameters') {
            return parameters;
        }
        return selectedItems;
    }, [dataViewMode, parameters, selectedItems]);

    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const isEmpty = data.length === 0;

    const emptyMessage = useMemo(() => {
        if (dataViewMode === 'parameters') {
            return 'Нет созданных параметров';
        }

        const scene = currentSceneId ? scenes[currentSceneId] : null;
        const items = scene?.items ?? [];

        if (items.length === 0) {
            return 'Создайте хотя бы один элемент';
        }

        return 'Выберите элементы для просмотра';
    }, [dataViewMode, currentSceneId, scenes]);

    const handleFilterChange = (filtered: any[]) => {
        setFilteredData(filtered);
    };

    return (
        <div className="flex flex-col gap-1 overflow-y-auto m-1 h-full">
            <div className="flex gap-1 text-sm bg-background p-1 rounded-md border border-depth-2">
                {Object.entries(VIEW_LABELS).map(([mode, label]) => (
                    <button
                        key={mode}
                        onClick={() => setDataViewMode(mode as DataViewMode)}
                        className={`
                            px-3 h-9 rounded-md w-full cursor-pointer 
                            bg-depth-2 hover:bg-depth-3 border border-depth-3
                            ${dataViewMode === mode ? 'opacity-100' : 'opacity-50'}
                        `}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isEmpty ? (
                <EmptyState message={emptyMessage} />
            ) : (
                <div className="flex flex-col gap-1">
                    {showFilters && <KeyFilters data={data} onFilterChange={handleFilterChange} />}

                    <div className="relative bg-depth-2 border border-depth-3 rounded-md w-full h-max">
                        <CodeBlock data={filteredData} onToggleFilters={toggleShowFilters} showFilters={showFilters} />
                    </div>
                </div>
            )}
        </div>
    );
};
