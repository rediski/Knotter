'use client';

interface ScenePaginationProps {
    totalItems: number;
    visibleRange: { start: number; end: number };
    onScrollToScene: (index: number) => void;
}

export const ScenePagination = ({ totalItems, visibleRange, onScrollToScene }: ScenePaginationProps) => {
    if (totalItems <= 3) return null;

    const indicators = [];

    for (let groupStart = 0; groupStart < totalItems; groupStart += 3) {
        const groupEnd = Math.min(groupStart + 3, totalItems);
        const groupSize = groupEnd - groupStart;

        const renderGroup = () => {
            if (groupSize === 3) {
                const visibleStart = Math.max(visibleRange.start, groupStart);
                const visibleEnd = Math.min(visibleRange.end, groupEnd);
                const firstVisibleIndex = visibleStart - groupStart;
                const visibleCount = Math.max(0, visibleEnd - visibleStart);

                const leftOffset = (firstVisibleIndex / groupSize) * 100;
                const fillWidth = (visibleCount / groupSize) * 100;

                return (
                    <button
                        key={`group-${groupStart}`}
                        onClick={() => onScrollToScene(groupStart)}
                        className="relative w-6 h-2 rounded-full cursor-pointer overflow-hidden bg-depth-4"
                        title={`Перейти к сценам ${groupStart + 1}-${groupEnd}`}
                    >
                        <div
                            className="absolute top-0 h-full bg-text-accent transition-all duration-150"
                            style={{
                                left: `${leftOffset}%`,
                                width: `${fillWidth}%`,
                            }}
                        />
                    </button>
                );
            }

            return (
                <button
                    key={`group-${groupStart}`}
                    onClick={() => onScrollToScene(groupStart)}
                    className="flex items-center justify-center h-2 gap-1.25 cursor-pointer"
                    title={
                        groupSize === 1
                            ? `Перейти к сцене ${groupStart + 1}`
                            : `Перейти к сценам ${groupStart + 1}-${groupEnd}`
                    }
                >
                    {Array.from({ length: groupSize }, (_, i) => {
                        const itemIndex = groupStart + i;
                        const isItemVisible = itemIndex >= visibleRange.start && itemIndex < visibleRange.end;

                        return (
                            <div
                                key={`dot-${itemIndex}`}
                                className={`w-2 h-2 rounded-full
                                    ${isItemVisible ? 'bg-text-accent' : 'bg-depth-4'}
                                `}
                            />
                        );
                    })}
                </button>
            );
        };

        indicators.push(renderGroup());
    }

    return <div className="absolute -bottom-5 left-0 right-0 flex justify-center items-center gap-1.5">{indicators}</div>;
};
