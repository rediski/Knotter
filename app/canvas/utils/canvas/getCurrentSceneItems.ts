import { getCurrentScene } from '@/canvas/utils/canvas/getCurrentScene';

export const getCurrentSceneItems = () => {
    const scene = getCurrentScene();
    return scene?.items ?? [];
};
