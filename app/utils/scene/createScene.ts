import { v4 as uuid } from 'uuid';
import type { Scene } from '@/_core/_/canvas.types';
import { MAX_SCENES } from '@/_core/_/canvas.constants';
import { useItemsStore } from '@/store/useItemsStore';

export async function createScene(name?: string): Promise<string | null> {
    const { scenes, setScenes, setCurrentSceneId } = useItemsStore.getState();

    const currentScenesCount = Object.keys(scenes).length;

    if (currentScenesCount >= MAX_SCENES) {
        return null;
    }

    const baseName = name || 'Сцена';

    const existingNames = Object.values(scenes).map((scene) => scene.name);

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
        description: '',
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
