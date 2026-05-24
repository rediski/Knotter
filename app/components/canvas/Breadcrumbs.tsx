'use client';

import Link from 'next/link';

import { useItemsStore } from '@/store/useItemsStore';
import { getNodeById } from '@/utils/nodes/getNodeById';
import { ChevronRight, LandPlot, Box } from 'lucide-react';

export function Breadcrumbs() {
    const { currentSceneId, currentNodeId } = useItemsStore();

    if (!currentSceneId) {
        return null;
    }

    const node = currentNodeId ? getNodeById(currentNodeId) : null;

    const nodeName = node?.name || currentNodeId;

    const scene = useItemsStore.getState().scenes[currentSceneId];

    if (!scene) {
        return null;
    }

    return (
        <>
            <Link
                href={`/${scene.id}/`}
                className={`
                    flex items-center gap-1 px-3 py-1.25 min-w-64 rounded-md border cursor-pointer text-sm
                    ${currentSceneId === scene.id && currentNodeId === null ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-2 hover:bg-depth-3 border-depth-3'}
                `}
            >
                <LandPlot size={16} />

                <hr
                    className={`h-5 mx-1 border-l
                    ${currentSceneId === scene.id ? 'border-bg-accent/10' : 'border-depth-3'}`}
                />

                {scene.name}
            </Link>

            {currentNodeId && (
                <>
                    <ChevronRight size={16} className="text-gray" />
                    <Link
                        href={`/${scene.id}/${currentNodeId}`}
                        className={`
                            flex items-center gap-1 px-3 py-1.25 min-w-64 rounded-md border cursor-pointer text-sm
                            bg-bg-accent/10 border-bg-accent/10 text-text-accent
                        `}
                    >
                        <Box size={16} />

                        <hr className="h-5 mx-1 border-l border-bg-accent/10" />

                        {nodeName}
                    </Link>
                </>
            )}
        </>
    );
}
