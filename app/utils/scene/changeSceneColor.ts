import { useItemsStore } from '@/store/useItemsStore';

export function changeSceneColor(sceneId: string, newColor: string | null): boolean {
    if (!sceneId || !newColor) {
        return false;
    }

    const state = useItemsStore.getState();
    const scene = state.scenes[sceneId];

    if (!scene) {
        return false;
    }

    const updatedScene = {
        ...scene,
        color: newColor,
    };

    state.setScenes({
        ...state.scenes,
        [sceneId]: updatedScene,
    });

    return true;
}
