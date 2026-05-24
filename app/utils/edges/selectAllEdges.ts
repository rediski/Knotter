import { useItemsStore } from '@/store/useItemsStore';

export function selectAllEdges() {
    const { currentSceneId, scenes, setSelectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const edgeIds = items.filter((item) => item.kind === 'edge').map((edge) => edge.id);

    setSelectedItemIds(edgeIds);
}
