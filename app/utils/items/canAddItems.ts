import { MAX_SCENE_ITEMS } from '@/_core/_/canvas.constants';
import { useItemsStore } from '@/store/useItemsStore';

export function canAddItem(): boolean {
    return canAddItems(1);
}

export function canAddItems(count: number): boolean {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return true;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    if (items.length + count > MAX_SCENE_ITEMS) {
        console.warn(
            `Невозможно добавить ${count} элементов. ` + `Текущее количество: ${items.length}, лимит: ${MAX_SCENE_ITEMS}.`,
        );
        return false;
    }

    return true;
}
