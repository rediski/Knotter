import { useEffect, useReducer, type RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useCanvasRefsStore } from '@/canvas/store/canvasRefStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getScreenCoords } from '@/canvas/utils/canvas/getScreenCoords';

export const Edge = ({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) => {
    const items = useCanvasStore((state) => state.items);
    const tempEdge = useCanvasStore((state) => state.tempEdge);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const selectedEdgeIds = useCanvasStore((state) => state.selectedEdgeIds);

    const mousePosition = useCanvasRefsStore((state) => state.mousePosition);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        if (!tempEdge) return;

        let frame: number | null = null;

        const handleMove = () => {
            if (frame !== null) return;

            frame = requestAnimationFrame(() => {
                forceUpdate();
                frame = null;
            });
        };

        window.addEventListener('mousemove', handleMove);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, [tempEdge]);

    const nodes = getNodes(items);
    const edges = getEdges(items);

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge) => {
                const fromNode = nodes.find((node) => node.id === edge.from);
                const toNode = nodes.find((node) => node.id === edge.to);

                if (!fromNode || !toNode) return null;

                const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);
                const toCoords = getScreenCoords(toNode.position.x, toNode.position.y, containerRef);

                const isSelected = selectedEdgeIds.includes(edge.id);

                return (
                    <line
                        key={edge.id}
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
            })}

            {tempEdge &&
                (() => {
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
                })()}
        </svg>
    );
};
