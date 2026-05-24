import { type RefObject } from 'react';
import { getEdges } from '@/utils/edges/getEdges';

import { Edge } from '@/_core/Edge';
import { TempEdge } from '@/_core/Edge/TempEdge';
import { useItemsStore } from '@/store/useItemsStore';

export const EdgeRenderer = ({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) => {
    const { currentSceneId, scenes } = useItemsStore();
    const tempEdge = useItemsStore((state) => state.tempEdge);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const edges = getEdges(items);

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge) => (
                <Edge key={edge.id} edge={edge} containerRef={containerRef} />
            ))}

            {tempEdge && <TempEdge containerRef={containerRef} />}
        </svg>
    );
};
