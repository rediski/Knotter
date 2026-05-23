import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const openNodeTab = (nodeId: string, router: AppRouterInstance) => {
    const openedTabIds = useCanvasStore.getState().openedTabIds;
    const setOpenedTabIds = useCanvasStore.getState().setOpenedTabIds;
    const activeSceneId = useItemsStore.getState().activeSceneId;

    if (!openedTabIds.includes(nodeId)) {
        setOpenedTabIds([...openedTabIds, nodeId]);
    }

    if (activeSceneId !== null) {
        router.push(`/canvas/${activeSceneId}/${nodeId}`);
    }
};
