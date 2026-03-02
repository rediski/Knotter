import type { NodeShapeType } from '@/canvas/_core/_/nodeShapeType';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function changeShapeType(newShape: NodeShapeType) {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const selectedItemIds = itemsStore.selectedItemIds;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && selectedItemIds.includes(item.id)) {
            return { ...item, shapeType: newShape };
        }

        return item;
    });

    setItems(updatedItems);
}
