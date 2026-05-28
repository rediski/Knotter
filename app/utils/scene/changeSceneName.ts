import { useItemsStore } from '@/store/useItemsStore';

export function changeSceneName(sceneId: string, newName: string): boolean {
    if (!sceneId || !newName?.trim()) {
        return false;
    }

    const scenes = useItemsStore.getState().scenes;
    const scene = scenes[sceneId];

    if (!scene) {
        return false;
    }

    const updatedScene = {
        ...scene,
        name: newName.trim(),
    };

    const updatedScenes = {
        ...scenes,
        [sceneId]: updatedScene,
    };

    useItemsStore.getState().setScenes(updatedScenes);
    return true;
}
