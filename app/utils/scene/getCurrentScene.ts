import type { Scene } from '@/_core/_/canvas.types';
import { useItemsStore } from '@/store/useItemsStore';

export function getCurrentScene(): Scene | null {
    const { currentSceneId, scenes } = useItemsStore.getState();
    return currentSceneId ? (scenes[currentSceneId] ?? null) : null;
}
