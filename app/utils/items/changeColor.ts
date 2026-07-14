import { useItemsStore } from '@/store/useItemsStore';
import { addToHistory } from '@/utils/history/historyManager';

export function changeColor(newColor: string) {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const changedItems = items.filter((item) => selectedItemIds.includes(item.id));

    const updatedItems = items.map((item) => {
        if (selectedItemIds.includes(item.id)) {
            return { ...item, color: newColor };
        }

        return item;
    });

    if (scene && changedItems.length > 0) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });

        addToHistory({
            type: 'CHANGE_ITEMS',
            items: structuredClone(changedItems),
        });
    }
}
