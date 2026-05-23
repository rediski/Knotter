import type { Scene } from '@/canvas/_core/_/canvas.types';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function getCurrentScene(): Scene | null {
    const { activeSceneId, scenes } = useItemsStore.getState();
    return activeSceneId ? (scenes.get(activeSceneId) ?? null) : null;
}
