import { useItemsStore } from '@/store/useItemsStore';

export function deleteScene(sceneId: string): boolean {
    const { scenes, setScenes, currentSceneId, setCurrentSceneId } = useItemsStore.getState();

    if (!scenes[sceneId]) return false;

    const { [sceneId]: removed, ...rest } = scenes;
    setScenes(rest);

    if (currentSceneId === sceneId) {
        const firstSceneId = Object.keys(rest)[0];
        setCurrentSceneId(firstSceneId ?? null);
    }

    return true;
}
