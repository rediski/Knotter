import { CodeBlock } from '@/components/UI/CodeBlock';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { EmptyState } from '@/components/UI/EmptyState';

export const Parameters = () => {
    const parameters = useItemsStore((state) => state.parameters);

    if (parameters.length === 0) {
        return <EmptyState message="У вас нет созданных параметров" />;
    }

    return (
        <div className="relative m-1 p-4 bg-depth-2 border border-depth-3 rounded-md overflow-y-auto">
            <CodeBlock data={parameters} />
        </div>
    );
};
