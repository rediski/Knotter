'use client';

import { Node } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NodeRenderer } from '@/canvas/components/CanvasNodes/NodeRenderer';
import { NodeTooltip } from '@/canvas/components/CanvasNodes/NodeTooltip';

import { NODE_SIZE } from '@/canvas/canvas.constants';

interface CanvasNodesProps {
    nodes: Node[];
    selectedNodeIds: string[];
    hoveredNodeId?: string | null;
}

export function CanvasNodes({ nodes, selectedNodeIds, hoveredNodeId }: CanvasNodesProps) {
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const offset = useCanvasStore((state) => state.offset);
    const tooltipMode = useCanvasStore((state) => state.tooltipMode);
    const editorMode = useCanvasStore((state) => state.editorMode);
    const invertY = useCanvasStore((state) => state.invertY);

    return (
        <div className="absolute">
            {nodes.map((node) => {
                const isSelected = selectedNodeIds.includes(node.id);

                const baseX = node.position.x * zoomLevel + offset.x;
                const baseY = node.position.y * zoomLevel + offset.y;

                const screenX = baseX;
                const screenY = invertY ? -baseY + window.innerHeight : baseY;

                return (
                    <div
                        key={node.id}
                        className="absolute"
                        data-node-id={node.id}
                        style={{
                            left: screenX,
                            top: screenY,
                            transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                            transformOrigin: 'center',
                        }}
                    >
                        <NodeRenderer editorMode={editorMode} node={node} isSelected={isSelected} />
                    </div>
                );
            })}

            {nodes.map((node) => {
                const isHovered = hoveredNodeId === node.id;
                const isViewEditorMode = editorMode === 'view';

                const shouldShowTooltip = Boolean(
                    node.name && (tooltipMode === 'always' || (tooltipMode === 'hover' && isHovered)),
                );

                if (!shouldShowTooltip || !isViewEditorMode) return null;

                const baseX = node.position.x * zoomLevel + offset.x;
                const baseY = node.position.y * zoomLevel + offset.y;

                const screenX = baseX;
                const screenY = invertY ? -baseY + window.innerHeight : baseY;

                const tooltipYOffset = (NODE_SIZE / 2) * zoomLevel + 8 * zoomLevel;
                const tooltipY = screenY - tooltipYOffset;

                return (
                    <NodeTooltip
                        key={node.id}
                        label={node.name}
                        position={{ x: screenX, y: tooltipY }}
                        zoomLevel={zoomLevel}
                    />
                );
            })}
        </div>
    );
}
