import type { CanvasItem } from '@/_core/_/canvas.types';
import type { CanvasAction } from '@/_core/_/history.types';

import { useItemsStore } from '@/store/useItemsStore';

export function restoreCanvasFromHistory(actions: CanvasAction[]) {
    const { currentSceneId, scenes, setSelectedItemIds, setScenes } = useItemsStore.getState();

    if (!currentSceneId) return;
    if (actions.length === 0) return;

    let canvasItems: CanvasItem[] = [];

    for (const action of actions) {
        switch (action.type) {
            case 'ADD_ITEMS':
            case 'PASTE_ITEMS': {
                canvasItems = [...canvasItems, ...action.items];
                break;
            }

            case 'DELETE_ITEMS': {
                const deleteIds = new Set(action.items.map((item) => item.id));
                canvasItems = canvasItems.filter((item) => !deleteIds.has(item.id));
                break;
            }

            case 'CHANGE_ITEMS': {
                const changeMap = new Map(action.items.map((item) => [item.id, item]));

                canvasItems = canvasItems.map((item) => {
                    const changedItem = changeMap.get(item.id);
                    return changedItem ? { ...item, ...changedItem } : item;
                });

                break;
            }
        }
    }

    const scene = scenes[currentSceneId];
    if (scene) {
        const updatedScene = {
            ...scene,
            items: canvasItems,
            updatedAt: new Date(),
        };

        setScenes({
            ...scenes,
            [currentSceneId]: updatedScene,
        });
    }

    setSelectedItemIds([]);
}
