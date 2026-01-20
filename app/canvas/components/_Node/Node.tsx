import { NodeParameters } from '@/canvas/components/CanvasNodes/NodeParameters';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getShape } from '@/canvas/utils/nodes/getShape';

export default function Node() {
    const selectedItem = useCanvasStore((state) => state.selectedItem);

    if (selectedItem?.kind !== 'node') return;

    const currentShape = getShape(selectedItem.shapeType);

    return (
        <div className="flex flex-col gap-2 w-full h-full bg-depth-1 border border-depth-3 rounded-md p-1">
            <div className="flex gap-4 items-start bg-depth-2 max-w-2xl p-4 rounded-md">
                <currentShape.icon className="min-w-16 h-16" />

                <div className="flex flex-col">
                    <h2 className="text-xl">{selectedItem.name}</h2>

                    <p className="text-foreground/70">{selectedItem.description}</p>
                </div>
            </div>

            <h3 className="text-lg">Свойства: </h3>

            <NodeParameters node={selectedItem} />
        </div>
    );
}
