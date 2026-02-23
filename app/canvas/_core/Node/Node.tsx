'use client';

import { useRef, useEffect } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NodeRenderer } from '@/canvas/_core/Node/NodeRenderer';
import { NodeTooltip } from '@/canvas/_core/Node/NodeTooltip';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NODE_SIZE } from '@/canvas/_core/_/canvas.constants';
import { EdgeRenderer } from './EdgeRenderer';
import { getScreenCoords } from '@/canvas/utils/canvas/getScreenCoords';
import { openTab } from '@/canvas/utils/canvas/openTab';

type NodeProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
};

export const Node: React.FC<NodeProps> = ({ containerRef }) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const DOUBLE_CLICK_DELAY = 250;

    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const tooltipMode = useCanvasStore((state) => state.tooltipMode);

    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const hoveredNodeId = useCanvasStore((state) => state.hoveredNodeId);

    const nodes = getNodes(items);

    const handleNodeClick = (nodeId: string) => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;

            openTab(nodeId);
            return;
        }

        clickTimeoutRef.current = setTimeout(() => {
            clickTimeoutRef.current = null;
        }, DOUBLE_CLICK_DELAY);
    };

    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div ref={nodeRef} className="absolute inset-0">
            <EdgeRenderer containerRef={containerRef} />

            {nodes.map((node) => {
                const isSelected = selectedItemIds.includes(node.id);
                const { x: screenX, y: screenY } = getScreenCoords(node.position.x, node.position.y, containerRef);

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
                        onClick={() => handleNodeClick(node.id)}
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

                const { x: screenX, y: screenY } = getScreenCoords(node.position.x, node.position.y, containerRef);

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
};
