import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { EmptyState } from '@/components/UI/EmptyState';

export const Clipboard = () => {
    const clipboard = useCanvasStore((state) => state.clipboard);

    return (
        <div className="flex flex-col gap-1 m-1 text-sm h-full">
            {clipboard.length !== 0 ? (
                clipboard.map((item) => {
                    return (
                        <div key={item.id} className="flex items-center px-3 py-1 bg-depth-2 rounded-md h-9">
                            {item.name}
                        </div>
                    );
                })
            ) : (
                <EmptyState message="Буфер обмена пуст" />
            )}
        </div>
    );
};
