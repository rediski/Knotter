'use client';

import { NodeParameters } from '@/canvas/_core/Node/NodeParameters';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export default function NodeContent() {
    const items = useCanvasStore((state) => state.items);
    const selectedTabId = useCanvasStore((state) => state.selectedTabId);
    const openedNode = items.find((item) => item.id === selectedTabId && item.kind === 'node');

    if (openedNode?.kind !== 'node') return null;

    const nodes = getNodes(items);

    const incoming =
        openedNode.edgeFrom?.length &&
        openedNode.edgeFrom
            .map((id) => nodes.find((node) => node.id === id)?.name)
            .filter(Boolean)
            .join(', ');

    const outgoing =
        openedNode.edgeTo?.length &&
        openedNode.edgeTo
            .map((id) => nodes.find((node) => node.id === id)?.name)
            .filter(Boolean)
            .join(', ');

    return (
        <div className="flex flex-col gap-1 w-full overflow-y-auto">
            <div className="flex gap-1">
                <div className="flex-1/3 min-w-sm w-full h-fit p-3 bg-depth-1 border border-depth-3 rounded-md sticky top-0">
                    <div className="flex flex-col gap-1">
                        <h2 className="bg-depth-2 py-1 px-3 rounded-md">{openedNode.name || 'Название'}</h2>

                        <p className="bg-depth-2 py-1 px-3 rounded-md text-foreground/70 whitespace-pre-wrap break-all hyphens-auto">
                            {openedNode.description || 'Описание'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-2/3 flex-col gap-1">
                    <div className="flex flex-col gap-1 bg-depth-1 w-full border border-depth-3 rounded-md text-sm p-3">
                        <div className="flex flex-col gap-1">
                            <div className="pl-3 bg-depth-3 py-1 px-3 rounded-md w-fit">Трансформация</div>

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center bg-depth-2 py-1 px-3 rounded-md">
                                    <span className="truncate">Положение X</span>
                                    <span className="text-text-accent truncate">{openedNode.position.x}</span>
                                </div>

                                <div className="flex justify-between items-center bg-depth-2 py-1 px-3 rounded-md">
                                    <span className="truncate">Положение Y</span>
                                    <span className="text-text-accent truncate">{openedNode.position.y}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="pl-3 bg-depth-3 py-1 px-3 rounded-md w-fit">Связи</div>

                            <div className="flex justify-between items-center bg-depth-2 py-1 px-3 rounded-md">
                                <span className="truncate">Входящие</span>
                                <span className="text-text-accent truncate">{incoming}</span>
                            </div>

                            <div className="flex justify-between items-center bg-depth-2 py-1 px-3 rounded-md">
                                <span className="truncate">Исходящие</span>
                                <span className="text-text-accent truncate">{outgoing}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="pl-3 bg-depth-3 py-1 px-3 rounded-md w-fit">Наследники</div>

                            <div className="flex justify-between items-center bg-depth-2 py-1 px-3 rounded-md">
                                <span className="truncate">В разработке...</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-depth-1 border border-depth-3 rounded-md p-3">
                        <NodeParameters node={openedNode} />
                    </div>
                </div>
            </div>
        </div>
    );
}
