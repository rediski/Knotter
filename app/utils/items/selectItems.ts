import { useItemsStore } from '@/store/useItemsStore';
import { updateSelection } from '@/utils/items/updateSelection';

export interface SelectCanvasItemEvent {
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export interface SelectCanvasItemParams {
    itemId: string;
    event: SelectCanvasItemEvent;
}

export function selectItems(params: SelectCanvasItemParams): string[] {
    const { itemId, event: e } = params;

    const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return [...selectedItemIds];

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const item = items.find((item) => item.id === itemId);

    if (!item) return [...selectedItemIds];

    return updateSelection({
        items,
        selectedIds: selectedItemIds,
        targetId: itemId,
        getItemId: (item) => item.id,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
    });
}
