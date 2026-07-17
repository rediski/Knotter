import type { ReactNode } from 'react';
import type { CanvasAction } from '@/_core/_/history.types';

import { EmptyState } from '@/components/UI/EmptyState';

import { useHistoryStore } from '@/store/useHistoryStore';
import { restoreCanvasFromHistory } from '@/utils/history/restoreCanvasFromHistory';

import { Pencil, Trash2, Plus, ClipboardPaste } from 'lucide-react';

export const History = () => {
    const history = useHistoryStore((state) => state.history);
    const historyPosition = useHistoryStore((state) => state.historyPosition);
    const setHistoryPosition = useHistoryStore((state) => state.setHistoryPosition);

    const handleHistoryClick = (index: number) => {
        setHistoryPosition(index);

        const actionsUpToIndex = history.slice(0, index + 1);
        restoreCanvasFromHistory(actionsUpToIndex);
    };

    const getActionInfo = (action: CanvasAction) => {
        const actionMap: Record<CanvasAction['type'], { icon: ReactNode; label: string }> = {
            ADD_ITEMS: {
                icon: <Plus className="w-4 h-4" />,
                label: 'Добавление элементов',
            },
            DELETE_ITEMS: {
                icon: <Trash2 className="w-4 h-4" />,
                label: 'Удаление элементов',
            },
            PASTE_ITEMS: {
                icon: <ClipboardPaste className="w-4 h-4" />,
                label: 'Вставка элементов',
            },
            CHANGE_ITEMS: {
                icon: <Pencil className="w-4 h-4" />,
                label: 'Изменение элементов',
            },
        };

        return actionMap[action.type];
    };

    const getItemsCount = (action: CanvasAction): number => {
        switch (action.type) {
            case 'ADD_ITEMS':
            case 'PASTE_ITEMS':
            case 'CHANGE_ITEMS':
                return action.items.length;
            case 'DELETE_ITEMS':
                return action.ids.length;
            default:
                return 0;
        }
    };

    return (
        <div className="flex flex-col gap-1 p-1 h-full pt-0 mt-1 text-sm overflow-auto">
            {history
                .map((action, index) => {
                    const isCurrent = index === historyPosition;
                    const isInFuture = index > historyPosition;
                    const orderNumber = index + 1;

                    const itemsCount = getItemsCount(action);
                    const actionInfo = getActionInfo(action);

                    return (
                        <div
                            key={index}
                            onClick={() => handleHistoryClick(index)}
                            className={`
                                group px-3 py-2 border rounded-md cursor-pointer
                                ${
                                    isCurrent
                                        ? 'bg-bg-accent/10 text-text-accent border-bg-accent/10'
                                        : 'bg-depth-2 border-depth-4 hover:bg-depth-3'
                                }
                                ${isInFuture ? 'opacity-50' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className={`${isCurrent ? 'text-text-accent' : 'text-foreground'}`}>
                                        {actionInfo.icon}
                                    </span>

                                    <div
                                        className={`border-l h-5 
                                            ${isCurrent ? 'border-bg-accent/10' : 'border-depth-4'}
                                        `}
                                    />

                                    <span className="font-medium truncate tabular-nums">
                                        {actionInfo.label} ({itemsCount})
                                    </span>
                                </div>

                                <span className="text-xs text-gray">#{orderNumber}</span>
                            </div>
                        </div>
                    );
                })
                .reverse()}

            {history.length === 0 && <EmptyState message="История пуста" />}
        </div>
    );
};
