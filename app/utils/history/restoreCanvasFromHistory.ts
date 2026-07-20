import type { CanvasItem } from '@/_core/_/canvas.types';
import type { CanvasAction } from '@/_core/_/history.types';

import { useItemsStore } from '@/store/useItemsStore';

export function restoreCanvasFromHistory(actions: CanvasAction[]) {
    const { currentSceneId, scenes, setSelectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    let canvasItems: CanvasItem[] = [];

    for (const action of actions) {
        switch (action.type) {
            case 'ADD_ITEMS':
            case 'PASTE_ITEMS':
                canvasItems = [...canvasItems, ...action.items];
                break;

            case 'DELETE_ITEMS':
                const deleteIds = action.items.map((item) => item.id);
                canvasItems = canvasItems.filter((item) => !deleteIds.includes(item.id));
                break;

            case 'CHANGE_ITEMS':
                canvasItems = canvasItems.map((item) => {
                    const changedItem = action.items.find((changed) => changed.id === item.id);
                    return changedItem ? { ...item, ...changedItem } : item;
                });
                break;
        }
    }

    const scene = scenes[currentSceneId];

    if (scene) {
        const updatedScene = {
            ...scene,
            items: canvasItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }

    setSelectedItemIds([]);
}
