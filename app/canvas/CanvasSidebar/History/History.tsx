import { useCanvasStore } from '@/canvas/store/canvasStore';

export const History = () => {
    const clipboard = useCanvasStore((state) => state.clipboard);

    return (
        <>
            {clipboard.map((item) => {
                return (
                    <div key={item.id} className="m-1 px-3 py-1 bg-depth-2 rounded-md">
                        {item.name}
                    </div>
                );
            })}
        </>
    );
};
