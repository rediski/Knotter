import { useClipboardStore } from '@/canvas/store/useClipboardStore';
import { EmptyState } from '@/components/UI/EmptyState';

export const Clipboard = () => {
    const clipboard = useClipboardStore((state) => state.clipboard);

    return (
        <div className="flex flex-col gap-1 m-1 text-sm h-full">
            {clipboard.length !== 0 ? (
                clipboard.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="flex items-center px-3 py-1 bg-depth-2 border border-depth-3 rounded-md h-9"
                        >
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
