import { useHistoryStore } from '@/store/useHistoryStore';
import { restoreCanvasFromHistory } from '@/utils/history/restoreCanvasFromHistory';
import { EmptyState } from '@/components/UI/EmptyState';

export const History = () => {
    const history = useHistoryStore((state) => state.history);
    const historyPosition = useHistoryStore((state) => state.historyPosition);
    const setHistoryPosition = useHistoryStore((state) => state.setHistoryPosition);

    const handleHistoryClick = (index: number) => {
        setHistoryPosition(index);

        const actionsUpToIndex = history.slice(0, index + 1);
        restoreCanvasFromHistory(actionsUpToIndex);
    };

    return (
        <div className="flex flex-col gap-1 p-1 h-full pt-0 mt-1 text-sm overflow-auto">
            {history.map((action, index) => {
                const isCurrent = index === historyPosition;
                const isInFuture = index > historyPosition;
                const orderNumber = index + 1;

                return (
                    <div
                        key={index}
                        onClick={() => handleHistoryClick(index)}
                        className={`
                            px-3 py-2 border rounded-md cursor-pointer
                            ${
                                isCurrent
                                    ? 'bg-bg-accent/10 text-text-accent border-bg-accent/10'
                                    : 'bg-depth-2 border-depth-4 hover:bg-depth-3'
                            }
                            ${isInFuture ? 'text-gray' : ''}
                        `}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="flex-1">{action.type}</span>
                            <span className="text-xs text-gray">#{orderNumber}</span>
                        </div>
                    </div>
                );
            })}

            {history.length === 0 && <EmptyState message="История пуста" />}
        </div>
    );
};
