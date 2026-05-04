import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const openNodeTab = (nodeId: string, router: AppRouterInstance) => {
    const openedTabIds = useCanvasStore.getState().openedTabIds;
    const setOpenedTabIds = useCanvasStore.getState().setOpenedTabIds;

    if (!openedTabIds.includes(nodeId)) {
        setOpenedTabIds([...openedTabIds, nodeId]);
    }

    router.push(`/canvas/${nodeId}`);
};
