import { v4 as uuid } from 'uuid';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import type { Scene } from '@/canvas/_core/_/canvas.types';

export function createScene(name?: string): Scene {
    const { scenes, setScenes, setActiveSceneId } = useItemsStore.getState();

    const baseName = name || 'Сцена';

    const existingNames = Array.from(scenes.values())
        .filter((scene): scene is Scene => scene !== null && scene !== undefined)
        .map((s) => s.name);

    let finalName = baseName;
    let counter = 1;

    while (existingNames.includes(finalName)) {
        counter++;
        finalName = `${baseName} ${counter}`;
    }

    const newScene: Scene = {
        kind: 'scene',
        id: uuid(),
        name: finalName,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const cleanScenes = new Map();
    for (const [key, value] of scenes) {
        if (value !== null && value !== undefined) {
            cleanScenes.set(key, value);
        }
    }

    cleanScenes.set(newScene.id, newScene);
    setScenes(cleanScenes);
    setActiveSceneId(newScene.id);

    return newScene;
}
