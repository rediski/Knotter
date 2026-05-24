'use client';

import { useRef, useEffect, type RefObject } from 'react';
import { useRouter } from 'next/navigation';

import { NODE_SIZE } from '@/_core/_/canvas.constants';

import { useCanvasStore } from '@/store/useCanvasStore';

import { EdgeRenderer } from '@/_core/Edge/EdgeRenderer';
import { NodeRenderer } from '@/_core/Node/NodeRenderer';
import { NodeTooltip } from '@/_core/Node/NodeTooltip';

import { useItemsStore } from '@/store/useItemsStore';

import { getNodes } from '@/utils/nodes/getNodes';
import { getScreenCoords } from '@/utils/canvas/getScreenCoords';
import { openNodeTab } from '@/utils/nodes/openNodeTab';

export const Node = ({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) => {
    const router = useRouter();
    const nodeRef = useRef<HTMLDivElement>(null);

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const DOUBLE_CLICK_DELAY = 250;

    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const tooltipMode = useCanvasStore((state) => state.tooltipMode);

    const { currentSceneId, scenes } = useItemsStore();
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);
    const hoveredNodeId = useItemsStore((state) => state.hoveredNodeId);

    const selectionStart = useItemsStore((state) => state.selectionStart);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const handleNodeClick = (nodeId: string) => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;

            openNodeTab(nodeId, router);
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
        <div ref={nodeRef} className="absolute inset-0 select-none">
            <EdgeRenderer containerRef={containerRef} />

            {nodes.map((node) => {
                const { x: screenX, y: screenY } = getScreenCoords(node.position.x, node.position.y, containerRef);

                return (
                    <div
                        key={node.id}
                        className={`absolute ${!selectionStart ? 'pointer-events-auto' : 'pointer-events-none'}`}
                        data-node-id={node.id}
                        style={{
                            left: `${screenX}px`,
                            top: `${screenY}px`,
                            transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                            transformOrigin: 'center',
                        }}
                        onClick={() => handleNodeClick(node.id)}
                    >
                        <NodeRenderer node={node} />
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

                const tooltipSpacing = 12;

                const tooltipYOffset = (NODE_SIZE / 2) * zoomLevel + tooltipSpacing * zoomLevel;
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
