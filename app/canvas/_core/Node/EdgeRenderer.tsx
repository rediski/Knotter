import React, { useEffect, useMemo, useRef } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useCanvasRefsStore } from '@/canvas/store/canvasRefStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getScreenCoords } from '@/canvas/utils/canvas/getScreenCoords';

type EdgeRendererProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
};

export const EdgeRenderer: React.FC<EdgeRendererProps> = ({ containerRef }) => {
    const items = useCanvasStore((state) => state.items);
    const invertY = useCanvasStore((state) => state.invertY);
    const tempEdge = useCanvasStore((state) => state.tempEdge);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const offset = useCanvasStore((state) => state.offset);

    const mousePosition = useCanvasRefsStore((state) => state.mousePosition);

    const tempLineRef = useRef<SVGLineElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const nodes = useMemo(() => getNodes(items), [items]);

    const nodeMap = useMemo(() => {
        const map = new Map<string, (typeof nodes)[number]>();
        nodes.forEach((node) => map.set(node.id, node));

        return map;
    }, [nodes]);

    useEffect(() => {
        const line = tempLineRef.current;
        if (!line) return;

        if (!tempEdge) {
            line.style.display = 'none';

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            return;
        }

        const fromNode = nodeMap.get(tempEdge);
        if (!fromNode) return;

        const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);

        line.setAttribute('x1', String(fromCoords.x));
        line.setAttribute('y1', String(fromCoords.y));
        line.style.display = 'block';

        const containerHeight = containerRef.current?.offsetHeight ?? 0;

        const update = () => {
            const { x, y } = mousePosition.current;

            const x2 = x * zoomLevel + offset.x;
            const y2 = invertY ? -y * zoomLevel + containerHeight + offset.y : y * zoomLevel + offset.y;

            line.setAttribute('x2', String(x2));
            line.setAttribute('y2', String(y2));

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [tempEdge, nodeMap, zoomLevel, offset, invertY, containerRef, mousePosition]);

    const renderedEdges = useMemo(() => {
        const lines: React.ReactNode[] = [];

        nodes.forEach((fromNode) => {
            if (!fromNode.edgeTo) return;

            const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);

            fromNode.edgeTo.forEach((toId) => {
                const toNode = nodeMap.get(toId);
                if (!toNode) return;

                const toCoords = getScreenCoords(toNode.position.x, toNode.position.y, containerRef);

                lines.push(
                    <line
                        key={`${fromNode.id}-${toId}`}
                        x1={fromCoords.x}
                        y1={fromCoords.y}
                        x2={toCoords.x}
                        y2={toCoords.y}
                        stroke="var(--contrast)"
                        strokeWidth={3}
                    />,
                );
            });
        });

        return lines;
    }, [nodes, nodeMap, containerRef]);

    return (
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
            {renderedEdges}

            <line
                ref={tempLineRef}
                stroke="var(--edge-temp)"
                strokeWidth={2}
                strokeDasharray="4 2"
                style={{ display: 'none' }}
            />
        </svg>
    );
};
