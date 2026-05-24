import { type RefObject } from 'react';
import { getScreenCoords } from '@/utils/canvas/getScreenCoords';
import { getNodes } from '@/utils/nodes/getNodes';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useItemsStore } from '@/store/useItemsStore';

import { type Edge as EdgeType } from '@/_core/_/canvas.types';

export const Edge = ({ edge, containerRef }: { edge: EdgeType; containerRef: RefObject<HTMLDivElement | null> }) => {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore();
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);

    const isSelected = selectedItemIds.includes(edge.id);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);
    const fromNode = nodes.find((node) => node.id === edge.from);
    const toNode = nodes.find((node) => node.id === edge.to);

    if (!fromNode || !toNode) return null;

    const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);
    const toCoords = getScreenCoords(toNode.position.x, toNode.position.y, containerRef);

    const minX = Math.min(fromCoords.x, toCoords.x);
    const minY = Math.min(fromCoords.y, toCoords.y);
    const width = Math.abs(toCoords.x - fromCoords.x);
    const height = Math.abs(toCoords.y - fromCoords.y);

    const dashArray = isSelected ? 8 * zoomLevel : undefined;
    const borderWidth = isSelected ? 2 * zoomLevel : 0;

    const MIN_SELECTION_RECT_SIZE = 32;

    const selectionRectSize = MIN_SELECTION_RECT_SIZE * zoomLevel;

    const finalWidth = Math.max(width, selectionRectSize);
    const finalHeight = Math.max(height, selectionRectSize);

    const offsetX = width < selectionRectSize ? (selectionRectSize - width) / 2 : 0;
    const offsetY = height < selectionRectSize ? (selectionRectSize - height) / 2 : 0;

    return (
        <g>
            <rect
                x={minX + 1.5 - offsetX}
                y={minY - offsetY}
                width={finalWidth}
                height={finalHeight}
                fill="transparent"
                stroke={isSelected ? '#3b82f6' : 'transparent'}
                strokeWidth={borderWidth}
                strokeDasharray={dashArray}
                rx={4}
                pointerEvents="none"
            />
            <line
                x1={fromCoords.x}
                y1={fromCoords.y}
                x2={toCoords.x}
                y2={toCoords.y}
                stroke={edge.color}
                strokeWidth={2 * zoomLevel}
                data-edge-id={edge.id}
                className="cursor-pointer pointer-events-auto"
            />
        </g>
    );
};
