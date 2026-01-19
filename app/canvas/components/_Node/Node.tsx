import { useCanvasStore } from '@/canvas/store/canvasStore';

export default function Node() {
    const selecteditem = useCanvasStore((state) => state.selectedItem);

    return (
        <div className="w-full h-full bg-depth-1 border border-depth-3 rounded-md">
            <div>{selecteditem?.name}</div>
        </div>
    );
}
