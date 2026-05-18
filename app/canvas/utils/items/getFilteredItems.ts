import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function getFilteredNodes(filterText: string) {
    const itemsStore = useItemsStore.getState();
    const items = itemsStore.items;

    const nodes = getNodes(items);
    const filteredText = filterText?.toLowerCase() || '';

    return nodes.filter((item) => item.name.toLowerCase().includes(filteredText));
}
