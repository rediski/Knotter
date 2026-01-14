'use client';

import { useRef, useEffect, useState } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NodeRenderer } from '@/canvas/components/CanvasNodes/NodeRenderer';
import { NodeTooltip } from '@/canvas/components/CanvasNodes/NodeTooltip';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NODE_SIZE } from '@/canvas/canvas.constants';

export function CanvasNodes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const offset = useCanvasStore((state) => state.offset);

    const tooltipMode = useCanvasStore((state) => state.tooltipMode);
    const invertY = useCanvasStore((state) => state.invertY);

    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const hoveredNodeId = useCanvasStore((state) => state.hoveredNodeId);

    const nodes = getNodes(items);

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const height = containerRef.current.getBoundingClientRect().height;
                setContainerHeight(height);
            }
        };

        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0">
            {nodes.map((node) => {
                const isSelected = selectedItemIds.includes(node.id);

                const baseX = node.position.x * zoomLevel + offset.x;
                const baseY = node.position.y * zoomLevel + offset.y;

                const screenX = baseX;
                const screenY = invertY && containerHeight > 0 ? -baseY + containerHeight : baseY;

                return (
                    <div
                        key={node.id}
                        className="absolute"
                        data-node-id={node.id}
                        style={{
                            left: `${screenX}px`,
                            top: `${screenY}px`,
                            transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                            transformOrigin: 'center',
                        }}
                    >
                        <NodeRenderer node={node} isSelected={isSelected} />
                    </div>
                );
            })}

            {nodes.map((node) => {
                const isHovered = hoveredNodeId === node.id;
                const isSelected = selectedItemIds.includes(node.id);

                const shouldShowTooltip = Boolean(
                    node.name && (tooltipMode === 'always' || (tooltipMode === 'hover' && isHovered)),
                );

                if (!shouldShowTooltip) return null;

                const baseX = node.position.x * zoomLevel + offset.x;
                const baseY = node.position.y * zoomLevel + offset.y;

                const screenX = baseX;
                const screenY = invertY && containerHeight > 0 ? -baseY + containerHeight : baseY;

                const tooltipYOffset = (NODE_SIZE / 2) * zoomLevel + 8 * zoomLevel;
                const tooltipY = screenY - tooltipYOffset;

                return (
                    <NodeTooltip
                        key={node.id}
                        node={node}
                        position={{ x: screenX, y: tooltipY }}
                        zoomLevel={zoomLevel}
                        isSelected={isSelected}
                    />
                );
            })}
        </div>
    );
}
