import { useCanvasStore } from '@/canvas/store/canvasStore';
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
    const mousePosition = useCanvasStore((state) => state.mousePosition);

    const nodes = getNodes(items);

    return (
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
            {nodes.map((fromNode) => {
                if (!fromNode.edgeTo || !Array.isArray(fromNode.edgeTo)) return null;

                const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);

                return fromNode.edgeTo.map((toId) => {
                    const toNode = nodes.find((node) => node.id === toId);
                    if (!toNode) return null;

                    const toCoords = getScreenCoords(toNode.position.x, toNode.position.y, containerRef);

                    return (
                        <line
                            key={`${fromNode.id}-${toId}`}
                            x1={fromCoords.x}
                            y1={fromCoords.y}
                            x2={toCoords.x}
                            y2={toCoords.y}
                            stroke={'var(--contrast)'}
                            strokeWidth={3}
                        />
                    );
                });
            })}

            {tempEdge &&
                (() => {
                    const fromNode = nodes.find((node) => node.id === tempEdge);
                    if (!fromNode) return null;

                    const fromCoords = getScreenCoords(fromNode.position.x, fromNode.position.y, containerRef);

                    const containerHeight = containerRef.current?.offsetHeight ?? 0;

                    const toCoords = {
                        x: mousePosition.x * zoomLevel + offset.x,
                        y: invertY
                            ? -mousePosition.y * zoomLevel + containerHeight + offset.y
                            : mousePosition.y * zoomLevel + offset.y,
                    };

                    return (
                        <line
                            x1={fromCoords.x}
                            y1={fromCoords.y}
                            x2={toCoords.x}
                            y2={toCoords.y}
                            stroke="var(--edge-temp)"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                        />
                    );
                })()}
        </svg>
    );
};
