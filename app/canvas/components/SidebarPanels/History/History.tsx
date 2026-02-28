import { useCanvasStore } from '@/canvas/store/canvasStore';

export const History = () => {
    const clipboard = useCanvasStore((state) => state.clipboard);

    return (
        <div className="flex flex-col gap-1 m-1 text-sm">
            {clipboard.map((item) => {
                return (
                    <div key={item.id} className="px-3 py-1 bg-depth-2 rounded-md">
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};
