import { useItemsStore } from '@/store/useItemsStore';

export function changeSceneDescription(sceneId: string, newDescription: string): boolean {
    if (!sceneId) {
        return false;
    }

    const state = useItemsStore.getState();
    const scene = state.scenes[sceneId];

    if (!scene) {
        return false;
    }

    const updatedScene = {
        ...scene,
        description: newDescription,
    };

    state.setScenes({
        ...state.scenes,
        [sceneId]: updatedScene,
    });

    return true;
}
