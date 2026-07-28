import { useClipboardStore } from '@/store/useClipboardStore';
import { EmptyState } from '@/components/UI/EmptyState';
import { LineSquiggle, Package } from 'lucide-react';

export const Clipboard = () => {
    const clipboard = useClipboardStore((state) => state.clipboard);

    return (
        <div className="flex flex-col gap-1 m-1 pr-1 text-sm h-full overflow-auto">
            {clipboard.length !== 0 ? (
                clipboard.map((item) => {
                    const isNode = item.kind === 'node';
                    const isEdge = item.kind === 'edge';

                    return (
                        <div
                            key={item.id}
                            className="flex items-center gap-2 px-3 py-1.75 bg-depth-2 border border-depth-3 rounded-md"
                        >
                            {isNode && <Package size={16} className="min-w-4 text-foreground" />}
                            {isEdge && <LineSquiggle size={16} className="min-w-4 text-foreground" />}

                            <div className="border-l h-5 border-depth-4" />

                            <span className="text-foreground">{item.name}</span>
                        </div>
                    );
                })
            ) : (
                <EmptyState message="Буфер обмена пуст" />
            )}
        </div>
    );
};
