import { EmptyState } from '@/components/UI/EmptyState';
import { CodeBlock } from '@/components/UI/CodeBlock';

import { getSelectedItems } from '@/utils/items/getSelectedItems';
import { useItemsStore } from '@/store/useItemsStore';

export const Details = () => {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const selectedItems = getSelectedItems({ items, selectedItemIds });

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
