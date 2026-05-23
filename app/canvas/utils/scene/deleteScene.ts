import { useItemsStore } from '@/canvas/store/useItemsStore';

export function deleteScene(sceneId: string): boolean {
    const { scenes, setScenes, activeSceneId, setActiveSceneId } = useItemsStore.getState();

    if (!scenes.has(sceneId)) return false;

    const newScenes = new Map(scenes);
    newScenes.delete(sceneId);
    setScenes(newScenes);

    if (activeSceneId === sceneId) {
        const firstScene = newScenes.values().next().value;
        setActiveSceneId(firstScene?.id ?? null);
    }

    return true;
}
