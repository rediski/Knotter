import { type RefObject } from 'react';
import { getScreenCoords } from '@/canvas/utils/canvas/getScreenCoords';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { type Edge as EdgeType } from '@/canvas/_core/_/canvas.types';

export const Edge = ({ edge, containerRef }: { edge: EdgeType; containerRef: RefObject<HTMLDivElement | null> }) => {
    const items = useItemsStore((state) => state.items);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const isSelected = selectedItemIds.includes(edge.id);

    const nodes = getNodes(items);
    const fromNode = nodes.find((node) => node.id === edge.from);
    const toNode = nodes.find((node) => node.id === edge.to);

    if (!fromNode || !toNode) return null;

    const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);
    const toCoords = getScreenCoords(toNode.position.x, toNode.position.y, containerRef);

    return (
        <line
            x1={fromCoords.x}
            y1={fromCoords.y}
            x2={toCoords.x}
            y2={toCoords.y}
            stroke={isSelected ? 'var(--color-bg-accent)' : 'var(--contrast)'}
            strokeWidth={2 * zoomLevel}
            data-edge-id={edge.id}
            className="cursor-pointer pointer-events-auto"
        />
    );
};
