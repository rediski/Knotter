import { useItemsStore } from '@/store/useItemsStore';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const openNodeTab = (nodeId: string, router: AppRouterInstance) => {
    const { currentSceneId } = useItemsStore.getState();

    if (currentSceneId !== null) {
        router.push(`/${currentSceneId}/${nodeId}`);
    }
};
