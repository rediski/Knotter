import { useItemsStore } from '@/store/useItemsStore';

export function changeColor(newColor: string) {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const updatedItems = items.map((item) => {
        if (selectedItemIds.includes(item.id)) {
            return { ...item, color: newColor };
        }

        return item;
    });

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }
}
