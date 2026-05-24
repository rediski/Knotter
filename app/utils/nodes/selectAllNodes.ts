import { useItemsStore } from '@/store/useItemsStore';

export function selectAllNodes() {
    const { currentSceneId, scenes, setSelectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    setSelectedItemIds(items.filter((item) => item.kind === 'node').map((node) => node.id));
}
