import { type RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getEdges } from '@/canvas/utils/edges/getEdges';

import { Edge } from '@/canvas/_core/Node/Edge';
import { TempEdge } from '@/canvas/_core/Node/TempEdge';

export const EdgeRenderer = ({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) => {
    const items = useCanvasStore((state) => state.items);
    const tempEdge = useCanvasStore((state) => state.tempEdge);

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
