'use client';

import { memo } from 'react';

import { NodeParameters } from '@/canvas/_core/Node/NodeParameters';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType'; // импортируйте из правильного пути

const Section = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border border-depth-3 bg-depth-2 rounded-md px-3 py-1">
        <div className="py-2">{title}</div>
        <div className="flex flex-col gap-1 flex-1 w-full">{children}</div>
    </div>
));

const InfoRow = memo(({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center gap-2 bg-depth-3 border border-depth-4 rounded-md py-1 px-3">
        <span className="truncate">{label}</span>
        <span className="truncate">{value}</span>
    </div>
));

export default function NodeContent() {
    const items = useItemsStore((state) => state.items);
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

    const shapeInfo = NODE_SHAPES[openedNode.shapeType as keyof typeof NODE_SHAPES];
    const Icon = shapeInfo?.icon;

    return (
        <div className="flex gap-1 w-full overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-1 max-w-2xl min-w-sm w-full h-fit p-1 bg-depth-1 border border-depth-3 rounded-md text-sm">
                <div className="flex flex-col border border-depth-3 bg-depth-2 rounded-md px-3 py-1">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={20} className="text-text-accent" />}
                        <h2 className="wrap-break-word text-base">{openedNode.name || '-'}</h2>
                    </div>

                    <p className="text-sm wrap-break-word text-text-accent-light mt-1">{openedNode.description || '-'}</p>
                </div>

                <div className="flex flex-col gap-1 w-full max-w-2xl">
                    <Section title="Трансформация">
                        <InfoRow label="Положение X" value={openedNode.position.x} />
                        <InfoRow label="Положение Y" value={openedNode.position.y} />
                    </Section>

                    {(incomingNodeIds.length > 0 || outgoingNodeIds.length > 0) && (
                        <Section title="Связи">
                            {incomingNodeIds.length > 0 && (
                                <InfoRow label="Входящие" value={truncateNames(incomingNodeIds)} />
                            )}
                            {outgoingNodeIds.length > 0 && (
                                <InfoRow label="Исходящие" value={truncateNames(outgoingNodeIds)} />
                            )}
                        </Section>
                    )}

                    <Section title="Наследники">
                        <InfoRow label="В разработке..." value="" />
                    </Section>
                </div>
            </div>

            <NodeParameters node={openedNode} />
        </div>
    );
}
