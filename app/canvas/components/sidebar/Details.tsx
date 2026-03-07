import { EmptyState } from '@/components/UI/EmptyState';
import { CodeBlock } from '@/components/UI/CodeBlock';

import { getSelectedItem } from '@/canvas/utils/items/getSelectedItems';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { ArrowDownToLine } from 'lucide-react';

export const Details = () => {
    const items = useItemsStore((state) => state.items);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const selectedItem = getSelectedItem({ items, selectedItemIds });

    const handleSave = () => {
        if (!selectedItem) return;

        const blob = new Blob([JSON.stringify(selectedItem, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'selected-item.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    if (selectedItem === null) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    return (
        <div className="relative m-1 p-4 bg-depth-2 rounded-md space-y-3 overflow-y-auto">
            <button
                onClick={handleSave}
                className="absolute right-2 top-2 p-2 rounded bg-depth-3 hover:bg-depth-4 shadow text-contrast cursor-pointer"
            >
                <ArrowDownToLine size={16} />
            </button>

            <CodeBlock data={selectedItem} />
        </div>
    );
};
