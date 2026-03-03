import { type RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useCanvasRefsStore } from '@/canvas/store/useCanvasRefsStore';

import { getScreenCoords } from '@/canvas/utils/canvas/getScreenCoords';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { useRefChangeObserver } from '@/hooks/useRefChangeObserver';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const TempEdge = ({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) => {
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);

    const items = useItemsStore((state) => state.items);
    const tempEdge = useItemsStore((state) => state.tempEdge);

    const mousePosition = useCanvasRefsStore((state) => state.mousePosition);
    useRefChangeObserver(mousePosition);

    const nodes = getNodes(items);

    const fromNode = nodes.find((node) => node.id === tempEdge);

    if (!fromNode) return null;

    const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);
    const toCoords = getScreenCoords(mousePosition.current.x, mousePosition.current.y, containerRef);

    return (
        <line
            x1={fromCoords.x}
            y1={fromCoords.y}
            x2={toCoords.x}
            y2={toCoords.y}
            stroke="var(--edge-temp)"
            strokeWidth={zoomLevel}
            strokeDasharray="4 2"
        />
    );
};
