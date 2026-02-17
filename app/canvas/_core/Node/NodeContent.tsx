'use client';

import { NodeParameters } from '@/canvas/_core/Node/NodeParameters';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';

export default function NodeContent() {
    const items = useCanvasStore((state) => state.items);
    const selectedTabId = useCanvasStore((state) => state.selectedTabId);

    const openedNode = items.find((item) => item.id === selectedTabId && item.kind === 'node');

    if (openedNode?.kind !== 'node') return null;

    const nodes = getNodes(items);
    const edges = getEdges(items);

    const truncateNames = (nodeIds: string[], maxEdges = 4) => {
        if (!nodeIds.length) return '';

        const connectedNames = nodeIds.map((id) => nodes.find((node) => node.id === id)?.name).filter(Boolean);

        if (connectedNames.length <= maxEdges) {
            return connectedNames.join(', ');
        }

        const displayed = connectedNames.slice(0, maxEdges);
        const remaining = connectedNames.length - maxEdges;

        return `${displayed.join(', ')} и ещё ${remaining}...`;
    };

    const incomingNodeIds = edges.filter((edge) => edge.to === openedNode.id).map((edge) => edge.from);
    const outgoingNodeIds = edges.filter((edge) => edge.from === openedNode.id).map((edge) => edge.to);

    const incoming = truncateNames(incomingNodeIds);
    const outgoing = truncateNames(outgoingNodeIds);

    return (
        <div className="flex flex-col gap-1 w-full overflow-y-auto overflow-x-hidden">
            <div className="max-w-2xl min-w-sm w-full h-fit p-3 bg-depth-1 border border-depth-3 rounded-md">
                <div className="flex flex-col">
                    <h2>{openedNode.name || '-'}</h2>
                    <p className="text-text-accent text-sm">{openedNode.description || '-'}</p>
                </div>
            </div>

            <div className="flex flex-col gap-1 w-full max-w-2xl min-w-sm">
                <div className="flex flex-col gap-1 bg-depth-1 w-full border border-depth-3 rounded-md text-sm p-3">
                    <div className="w-fit border border-depth-4 py-1 px-3">Трансформация</div>

                    <div className="flex flex-col gap-1 flex-1 w-full pl-4">
                        <div className="flex justify-between items-center gap-2 border border-depth-3 py-1 px-3">
                            <span className="truncate">Положение X</span>
                            <span className="text-text-accent truncate">{openedNode.position.x}</span>
                        </div>

                        <div className="flex justify-between items-center gap-2 border border-depth-3 py-1 px-3">
                            <span className="truncate">Положение Y</span>
                            <span className="text-text-accent truncate">{openedNode.position.y}</span>
                        </div>
                    </div>

                    <div className="w-fit border border-depth-4 py-1 px-3">Связи</div>

                    <div className="flex flex-col gap-1 flex-1 w-full pl-4">
                        <div className="flex justify-between items-center gap-2 border border-depth-3 py-1 px-3">
                            <span className="truncate">Входящие</span>
                            <span className="text-text-accent truncate">{incoming}</span>
                        </div>

                        <div className="flex justify-between items-center gap-2 border border-depth-3 py-1 px-3">
                            <span className="truncate">Исходящие</span>
                            <span className="text-text-accent truncate">{outgoing}</span>
                        </div>
                    </div>

                    <div className="w-fit border border-depth-4 py-1 px-3">Наследники</div>

                    <div className="flex flex-col gap-1 flex-1 w-full pl-4">
                        <div className="flex justify-between items-center gap-2 border border-depth-3 py-1 px-3">
                            <span className="truncate">В разработке...</span>
                        </div>
                    </div>
                </div>

                <NodeParameters node={openedNode} />
            </div>
        </div>
    );
}
