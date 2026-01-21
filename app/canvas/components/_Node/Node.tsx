import { NodeParameters } from '@/canvas/components/CanvasNodes/NodeParameters';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getShape } from '@/canvas/utils/nodes/getShape';

export default function Node() {
    const items = useCanvasStore((state) => state.items);
    const openedNodeId = useCanvasStore((state) => state.openedNodeId);
    const openedNode = items.find((item) => item.id === openedNodeId && item.kind === 'node');

    if (openedNode?.kind !== 'node') return;

    const currentShape = getShape(openedNode.shapeType);

    return (
        <div className="flex flex-col gap-1 w-full h-full">
            <div className="flex gap-1">
                <div className="flex gap-4 items-start bg-depth-1 border border-depth-3 w-full p-3 rounded-md">
                    <currentShape.icon className="min-w-16 h-16" />

                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl">{openedNode.name !== '' ? openedNode.name : 'Название'}</h2>

                        <p className="text-foreground/70 leading-5.5">
                            {openedNode.description !== '' ? openedNode.description : 'Описание'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 bg-depth-1 w-full border border-depth-3 rounded-md overflow-hidden">
                    <div className="font-medium truncate p-3 border-r border-b border-depth-3">Трансформация</div>

                    <div className="flex flex-col min-w-0 border-b border-depth-3">
                        <div className="flex items-center justify-between border-b border-depth-3 p-3">
                            <p className="truncate">Положение X</p>
                            <p className="text-text-accent truncate text-sm">{openedNode.position.x}</p>
                        </div>

                        <div className="flex items-center justify-between p-3">
                            <p className="truncate">Положение Y</p>
                            <p className="text-text-accent truncate text-sm">{openedNode.position.y}</p>
                        </div>
                    </div>

                    <div className="font-medium truncate p-3 border-r border-b border-depth-3">Связи</div>

                    <div className="p-3 border-b border-depth-3">
                        <p className="text-right truncate">В разработке...</p>
                    </div>

                    <div className="font-medium truncate p-3 border-r border-depth-3">Наследники</div>

                    <div className="p-3">
                        <p className="text-right truncate">В разработке...</p>
                    </div>
                </div>
            </div>

            <div className="bg-depth-1 border border-depth-3 rounded-md p-2">
                <NodeParameters node={openedNode} />
            </div>
        </div>
    );
}
