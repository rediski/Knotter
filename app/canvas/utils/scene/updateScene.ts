import type { Scene } from '@/canvas/_core/_/canvas.types';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function updateScene(sceneId: string, updates: Partial<Omit<Scene, 'id' | 'kind' | 'createdAt'>>): boolean {
    const { scenes, setScenes } = useItemsStore.getState();

    const scene = scenes.get(sceneId);
    if (!scene) return false;

    const updatedScene: Scene = {
        ...scene,
        ...updates,
        updatedAt: new Date(),
    };

    const newScenes = new Map(scenes);
    newScenes.set(sceneId, updatedScene);
    setScenes(newScenes);

    return true;
}
