import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import type { CanvasAction } from '@/canvas/_core/_/clipboard.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';

export function restoreCanvasFromHistory(actions: CanvasAction[]) {
    const setItems = useItemsStore.getState().setItems;
    const setSelectedItemIds = useItemsStore.getState().setSelectedItemIds;

    let canvasItems: CanvasItem[] = [];

    for (const action of actions) {
        switch (action.type) {
            case 'ADD_ITEMS':
            case 'PASTE_ITEMS':
                canvasItems = [...canvasItems, ...action.items];
                break;

            case 'DELETE_ITEMS':
                canvasItems = canvasItems.filter((item) => !action.ids.includes(item.id));
                break;
        }
    }

    setItems(canvasItems);
    setSelectedItemIds([]);
}
