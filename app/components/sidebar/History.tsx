import type { ReactNode } from 'react';
import type { CanvasAction } from '@/_core/_/history.types';

import { EmptyState } from '@/components/UI/EmptyState';

import { useItemsStore } from '@/store/useItemsStore';
import { restoreCanvasFromHistory } from '@/utils/scene/restoreCanvasFromHistory';

import { Pencil, Trash2, Plus, ClipboardPaste } from 'lucide-react';

const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const formatDateLabel = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Сегодня';
    if (isYesterday) return 'Вчера';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

export const History = () => {
    const scenes = useItemsStore((state) => state.scenes);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const setScenes = useItemsStore((state) => state.setScenes);

    const currentScene = currentSceneId ? scenes[currentSceneId] : null;

    if (!currentScene) {
        return (
            <div className="flex flex-col gap-1 p-1 h-full pt-0 mt-1 text-sm overflow-auto">
                <EmptyState message="Нет активной сцены" />
            </div>
        );
    }

    const { history, historyPosition } = currentScene;

    const handleHistoryClick = (index: number) => {
        if (!currentSceneId) return;

        const updatedScene = {
            ...currentScene,
            historyPosition: index,
        };

        setScenes({
            ...scenes,
            [currentSceneId]: updatedScene,
        });

        const actionsUpToIndex = history.slice(0, index + 1);
        restoreCanvasFromHistory(actionsUpToIndex);
    };

    const getActionInfo = (action: CanvasAction): { icon: ReactNode; label: string } => {
        const actionMap: Record<CanvasAction['type'], { icon: ReactNode; label: string }> = {
            ADD_ITEMS: {
                icon: <Plus className="w-4 h-4" />,
                label: 'Добавлено',
            },
            DELETE_ITEMS: {
                icon: <Trash2 className="w-4 h-4" />,
                label: 'Удалено',
            },
            PASTE_ITEMS: {
                icon: <ClipboardPaste className="w-4 h-4" />,
                label: 'Вставлено',
            },
            CHANGE_ITEMS: {
                icon: <Pencil className="w-4 h-4" />,
                label: 'Изменено',
            },
        };

        return actionMap[action.type];
    };

    const getItemNames = (action: CanvasAction): string => {
        switch (action.type) {
            case 'ADD_ITEMS':
            case 'PASTE_ITEMS':
            case 'CHANGE_ITEMS':
            case 'DELETE_ITEMS':
                return action.items.map((item) => item.name).join(', ');
            default:
                return '';
        }
    };

    const sortedHistory = [...history].sort((a, b) => {
        const timestampA = a.timestamp || 0;
        const timestampB = b.timestamp || 0;
        return timestampB - timestampA;
    });

    const groupedHistory: { date: string; items: CanvasAction[]; indices: number[] }[] = [];

    sortedHistory.forEach((action) => {
        if (!action.timestamp) return;

        const originalIndex = history.indexOf(action);
        const dateLabel = formatDateLabel(action.timestamp);
        const lastGroup = groupedHistory[groupedHistory.length - 1];

        if (lastGroup && lastGroup.date === dateLabel) {
            lastGroup.items.push(action);
            lastGroup.indices.push(originalIndex);

            return;
        }

        groupedHistory.push({
            date: dateLabel,
            items: [action],
            indices: [originalIndex],
        });
    });

    return (
        <div className="flex flex-col gap-1 p-1 h-full pt-0 mt-1 text-sm overflow-auto">
            {groupedHistory.length === 0 && <EmptyState message="История пуста" />}

            {groupedHistory.map((group, groupIndex) => (
                <div key={groupIndex} className="flex flex-col gap-1">
                    <div className="flex items-center justify-center my-2">
                        <span className="text-xs text-foreground/50 px-3 py-1 bg-depth-3/50 rounded-full">{group.date}</span>
                    </div>

                    {group.items.map((action, index) => {
                        const originalIndex = group.indices[index];
                        const isCurrent = originalIndex === historyPosition;
                        const isInFuture = originalIndex > historyPosition;

                        const actionInfo = getActionInfo(action);
                        const itemNames = getItemNames(action);

                        const timeString = action.timestamp ? formatTimestamp(action.timestamp) : '--:--';

                        return (
                            <div
                                key={originalIndex}
                                onClick={() => handleHistoryClick(originalIndex)}
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
                                            {actionInfo.label}: [{itemNames}]
                                        </span>
                                    </div>

                                    <span
                                        className={`
                                            text-xs tabular-nums 
                                            ${isCurrent ? 'text-text-accent' : 'text-foreground'}
                                        `}
                                    >
                                        {timeString}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
