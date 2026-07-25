'use client';

import { useState, useMemo } from 'react';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { EmptyState } from '@/components/UI/EmptyState';
import { KeyFilters } from '@/components/sidebar/KeyFilters';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { getSelectedItems } from '@/utils/items/getSelectedItems';

type ViewMode = 'parameters' | 'details';

export const Data = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('parameters');

    const parameters = useItemsStore((state) => state.parameters);
    const { currentSceneId, scenes } = useItemsStore();
    const { showFilters, toggleShowFilters } = useSidebarStore();

    const data = useMemo(() => {
        if (viewMode === 'parameters') {
            return parameters;
        }

        const scene = currentSceneId ? scenes[currentSceneId] : null;
        const items = scene?.items ?? [];

        return items.length > 0 ? getSelectedItems() : [];
    }, [viewMode, parameters, currentSceneId, scenes]);

    const [filteredData, setFilteredData] = useState(data);

    useMemo(() => {
        setFilteredData(data);
    }, [data]);

    const isEmpty = data.length === 0;

    const getEmptyMessage = () => {
        if (viewMode === 'parameters') {
            return 'У вас нет созданных параметров';
        }

        const scene = currentSceneId ? scenes[currentSceneId] : null;
        const items = scene?.items ?? [];

        if (items.length === 0) {
            return 'Создайте хотя бы один элемент';
        }

        return 'Необходимо выбрать один из элементов';
    };

    return (
        <div className="flex flex-col gap-1 overflow-y-auto m-1 h-full">
            <div className="flex gap-1 text-sm">
                <button
                    onClick={() => setViewMode('details')}
                    className={`px-3 py-1 rounded-md w-full cursor-pointer bg-depth-3 hover:bg-depth-4 max-w-xs ${
                        viewMode === 'details' ? 'opacity-100' : 'opacity-50'
                    }`}
                >
                    Элементы
                </button>

                <button
                    onClick={() => setViewMode('parameters')}
                    className={`px-3 py-1 rounded-md w-full cursor-pointer bg-depth-3 hover:bg-depth-4 max-w-xs ${
                        viewMode === 'parameters' ? 'opacity-100' : 'opacity-50'
                    }`}
                >
                    Параметры
                </button>
            </div>

            {isEmpty ? (
                <EmptyState message={getEmptyMessage()} />
            ) : (
                <div className="flex gap-1">
                    {showFilters && <KeyFilters data={data} onFilterChange={setFilteredData} />}

                    <div className="relative bg-depth-2 border border-depth-3 rounded-md w-full h-max">
                        <CodeBlock data={filteredData} onToggleFilters={toggleShowFilters} showFilters={showFilters} />
                    </div>
                </div>
            )}
        </div>
    );
};
