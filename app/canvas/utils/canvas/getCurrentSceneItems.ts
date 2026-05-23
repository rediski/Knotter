import { getCurrentScene } from '@/canvas/utils/scene/getCurrentScene';

export const getCurrentSceneItems = () => {
    const scene = getCurrentScene();
    return scene?.items ?? [];
};
