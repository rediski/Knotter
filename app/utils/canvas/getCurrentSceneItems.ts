import { getCurrentScene } from '@/utils/scene/getCurrentScene';

export const getCurrentSceneItems = () => {
    const scene = getCurrentScene();
    return scene?.items ?? [];
};
