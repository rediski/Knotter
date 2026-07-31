import { useItemsStore } from '@/store/useItemsStore';

export function changeSceneName(sceneId: string, newName: string): boolean {
    if (!sceneId || !newName?.trim()) {
        return false;
    }

    const state = useItemsStore.getState();
    const scene = state.scenes[sceneId];

    if (!scene) {
        return false;
    }

    const updatedScene = {
        ...scene,
        name: newName.trim(),
    };

    state.setScenes({
        ...state.scenes,
        [sceneId]: updatedScene,
    });

    return true;
}
