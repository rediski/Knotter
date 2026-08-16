'use client';

import { useParams } from 'next/navigation';

import { EmptyState } from '@/components/UI/EmptyState';

import { ParameterItem } from '@/components/sidebar/ParameterItem';
import { useParameters } from '@/components/sidebar/useParameters';

import { useItemsStore } from '@/store/useItemsStore';

import { hasParameterInNode } from '@/utils/nodes/hasParameterInNode';
import { createParameter } from '@/utils/parameters/createParameter';

import { Plus } from 'lucide-react';
import { generateUniqueName } from '@/utils/items/generateUniqueName';

export const Parameters = () => {
    const params = useParams();
    const nodeId = params.nodeId as string;

    const {
        filteredParameters,
        selectedParameters,
        selectParameters,
        deselect,
        visibleSelectedCount,
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    } = useParameters();

    const parameters = useItemsStore((state) => state.parameters);
    const currentNodeId = useItemsStore((state) => state.currentNodeId);

    const baseName = 'Параметр';
    const name = generateUniqueName(
        baseName,
        parameters.map((parameter) => parameter.name),
    );

    return (
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto max-h-[calc(100vh-8px-32px-4px)]">
            <button
                onClick={() => createParameter(name)}
                className="flex items-center justify-center gap-2 m-1 mb-0 h-8 rounded-md cursor-pointer bg-depth-2 hover:bg-depth-3 active:bg-depth-4 text-foreground border border-depth-3 text-sm"
            >
                <Plus size={16} />
                <span>Создать</span>
            </button>

            <ul
                className="flex flex-col gap-1 p-1 list-none relative"
                ref={listRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onClick={deselect}
            >
                {filteredParameters.length > 0 ? (
                    <>
                        {visibleSelectedCount > 1 && (
                            <div className="text-xs text-text-accent px-3 py-1 bg-bg-accent/5 rounded-md truncate">
                                Выбранных параметров: {visibleSelectedCount}
                            </div>
                        )}

                        {filteredParameters.map((parameter, index) => (
                            <ParameterItem
                                key={parameter.id}
                                parameter={parameter}
                                selectedIds={selectedParameters}
                                onSelect={selectParameters}
                                hasParameterInNode={hasParameterInNode(parameter.id, nodeId)}
                                currentNodeId={currentNodeId}
                                handleDragStart={handleDragStart}
                            />
                        ))}
                    </>
                ) : (
                    <EmptyState
                        message={parameters.length === 0 ? 'Параметры не найдены' : 'Параметры с таким именем не найдены'}
                    />
                )}
            </ul>
        </div>
    );
};
