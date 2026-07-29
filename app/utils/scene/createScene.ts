import { v4 as uuid } from 'uuid';
import { useItemsStore } from '@/store/useItemsStore';
import type { Scene } from '@/_core/_/canvas.types';

export async function createScene(name?: string): Promise<string> {
    const { scenes, setScenes, setCurrentSceneId } = useItemsStore.getState();

    const baseName = name || 'Сцена';

    const existingNames = Object.values(scenes).map((s) => s.name);

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
        history: [],
        historyPosition: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    setScenes({ ...scenes, [newScene.id]: newScene });
    setCurrentSceneId(newScene.id);

    return newScene.id;
}
