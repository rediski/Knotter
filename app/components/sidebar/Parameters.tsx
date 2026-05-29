'use client';

import { useState } from 'react';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { EmptyState } from '@/components/UI/EmptyState';
import { KeyFilters } from '@/components/sidebar/KeyFilters';

import { useItemsStore } from '@/store/useItemsStore';

export const Parameters = () => {
    const parameters = useItemsStore((state) => state.parameters);
    const [filteredParameters, setFilteredParameters] = useState(parameters);

    if (parameters.length === 0) {
        return <EmptyState message="У вас нет созданных параметров" />;
    }

    return (
        <div className="flex flex-col gap-1 overflow-y-auto m-1">
            <KeyFilters data={parameters} onFilterChange={setFilteredParameters} />

            <div className="relative bg-depth-2 border border-depth-3 rounded-md">
                <CodeBlock data={filteredParameters} />
            </div>
        </div>
    );
};
