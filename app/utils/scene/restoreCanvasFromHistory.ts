import type { CanvasItem } from '@/_core/_/canvas.types';
import type { CanvasAction } from '@/_core/_/history.types';

import { useItemsStore } from '@/store/useItemsStore';

export function restoreCanvasFromHistory(actions: CanvasAction[]) {
    const { currentSceneId, scenes, setSelectedItemIds, setScenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    // Если действий нет — ничего не делаем
    if (actions.length === 0) return;

    // Начинаем с пустого массива
    let canvasItems: CanvasItem[] = [];

    for (const action of actions) {
        switch (action.type) {
            case 'ADD_ITEMS':
            case 'PASTE_ITEMS': {
                // Добавляем новые элементы
                canvasItems = [...canvasItems, ...action.items];
                break;
            }

            case 'DELETE_ITEMS': {
                // Удаляем элементы по ID
                const deleteIds = new Set(action.items.map((item) => item.id));
                canvasItems = canvasItems.filter((item) => !deleteIds.has(item.id));
                break;
            }

            case 'CHANGE_ITEMS': {
                // Обновляем существующие элементы
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

        // Используем setScenes вместо прямого setState
        setScenes({
            ...scenes,
            [currentSceneId]: updatedScene,
        });
    }

    setSelectedItemIds([]);
}
