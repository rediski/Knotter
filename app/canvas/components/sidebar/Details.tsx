import { useState } from 'react';
import { EmptyState } from '@/components/UI/EmptyState';
import { CodeBlock } from '@/components/UI/CodeBlock';

import { getSelectedItems } from '@/canvas/utils/items/getSelectedItems';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const Details = () => {
    const [isCopied, setIsCopied] = useState(false);
    const items = useItemsStore((state) => state.items);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const selectedItems = getSelectedItems({ items, selectedItemIds });

    const getItemData = () => {
        if (!selectedItems) return null;
        return JSON.stringify(selectedItems, null, 2);
    };

    if (items.length === 0) {
        return <EmptyState message="Создайте хотя бы один элемент" />;
    }

    if (selectedItems.length === 0) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    return (
        <div className="relative m-1 bg-depth-2 border border-depth-3 rounded-md overflow-y-auto">
            <CodeBlock data={selectedItems} />
        </div>
    );
};
