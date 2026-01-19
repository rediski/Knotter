import { NodeParameters } from '@/canvas/components/CanvasNodes/NodeParameters';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export default function Node() {
    const selectedItem = useCanvasStore((state) => state.selectedItem);

    if (selectedItem?.kind !== 'node') return;

    return (
        <div className="w-full h-full bg-depth-1 border border-depth-3 rounded-md">
            <NodeParameters node={selectedItem} />
        </div>
    );
}
