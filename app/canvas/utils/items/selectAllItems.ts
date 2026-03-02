import { useItemsStore } from '@/canvas/store/useItemsStore';
import { selectAllEdges } from '@/canvas/utils/edges/selectAllEdges';

export function selectAllItems() {
    const itemsStore = useItemsStore.getState();
    const items = itemsStore.items;
    const setSelectedItemIds = itemsStore.setSelectedItemIds;

    selectAllEdges();
    setSelectedItemIds(items.map((item) => item.id));
}
