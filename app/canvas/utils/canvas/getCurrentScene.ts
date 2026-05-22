import { useItemsStore } from '@/canvas/store/useItemsStore';

export const getCurrentScene = () => {
    const { scenes, activeSceneId } = useItemsStore.getState();

    return scenes.find((scene) => scene.id === activeSceneId);
};
