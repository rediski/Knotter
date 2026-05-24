import { useItemsStore } from '@/store/useItemsStore';
import { getNodes } from '@/utils/nodes/getNodes';

export function getFilteredNodes(filterText: string) {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return [];

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const nodes = getNodes(items);
    const filteredText = filterText?.toLowerCase() || '';

    return nodes.filter((item) => item.name.toLowerCase().includes(filteredText));
}
