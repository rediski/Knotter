'use client';

import { useState } from 'react';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { EmptyState } from '@/components/UI/EmptyState';
import { KeyFilters } from '@/components/sidebar/KeyFilters';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

export const Data = () => {
    const parameters = useItemsStore((state) => state.parameters);
    const { showFilters, toggleShowFilters } = useSidebarStore();
    const [filteredParameters, setFilteredParameters] = useState(parameters);

    if (parameters.length === 0) {
        return <EmptyState message="У вас нет созданных параметров" />;
    }

    return (
        <div className="flex gap-1 overflow-y-auto m-1">
            {showFilters && <KeyFilters data={parameters} onFilterChange={setFilteredParameters} />}

            <div className="relative bg-depth-2 border border-depth-3 rounded-md w-full h-max">
                <CodeBlock data={filteredParameters} onToggleFilters={toggleShowFilters} showFilters={showFilters} />
            </div>
        </div>
    );
};
