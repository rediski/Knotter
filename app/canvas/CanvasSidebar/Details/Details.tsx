import { useCanvasStore } from '@/canvas/store/canvasStore';
import { EmptyState } from '@/components/UI/EmptyState';
import { ArrowDownToLine } from 'lucide-react';
import { CodeBlock } from '@/components/UI/CodeBlock';

export const Details = () => {
    const selectedItem = useCanvasStore((state) => state.selectedItem);

    const handleSave = () => {
        if (!selectedItem) return;

        const blob = new Blob([JSON.stringify(selectedItem, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'selected-item.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    if (selectedItem === null) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    return (
        <div className="relative m-1 p-4 bg-depth-2 rounded-md space-y-3 overflow-y-auto">
            <button
                onClick={handleSave}
                className="absolute right-2 top-2 p-2 rounded bg-depth-3 hover:bg-depth-4 shadow text-contrast cursor-pointer"
            >
                <ArrowDownToLine size={16} />
            </button>

            <CodeBlock data={selectedItem} />
        </div>
    );
};
