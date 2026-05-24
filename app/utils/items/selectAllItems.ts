import { useItemsStore } from '@/store/useItemsStore';

export function selectAllItems() {
    const { currentSceneId, scenes, setSelectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    setSelectedItemIds(items.map((item) => item.id));
}
